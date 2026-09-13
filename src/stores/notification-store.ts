import { create } from "zustand";

export type NotificationType =
  | "success"
  | "warning"
  | "rollback"
  | "info"
  | "workflow";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: number;
  read?: boolean;
}

interface NotificationState {
  notifications: AppNotification[];
  history: AppNotification[];
  unreadCount: number;
  simulateError: boolean;
  setSimulateError: (simulate: boolean) => void;
  toggleSimulateError: () => void;
  showNotification: (
    type: NotificationType,
    title: string,
    message?: string
  ) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  history: [],
  unreadCount: 0,
  simulateError: false,

  setSimulateError: (simulate) => set({ simulateError: simulate }),
  toggleSimulateError: () =>
    set((state) => ({ simulateError: !state.simulateError })),

  showNotification: (type, title, message) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newNotif: AppNotification = {
      id,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications.slice(0, 2)], // keep max 3 on screen
      history: [newNotif, ...state.history.slice(0, 19)], // keep last 20 in notification center
      unreadCount: state.unreadCount + 1,
    }));

    // Auto-dismiss floating toast after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),

  markAllAsRead: () =>
    set((state) => ({
      unreadCount: 0,
      history: state.history.map((n) => ({ ...n, read: true })),
    })),

  clearHistory: () => set({ history: [], unreadCount: 0 }),
}));
