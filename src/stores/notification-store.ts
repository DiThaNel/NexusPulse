import { create } from "zustand";

export type NotificationType = "success" | "warning" | "rollback" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: number;
}

interface NotificationState {
  notifications: AppNotification[];
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
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
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
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications.slice(0, 2)], // keep max 3
    }));

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4500);
  },

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}));
