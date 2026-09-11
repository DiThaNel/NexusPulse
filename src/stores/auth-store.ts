import { create } from "zustand";
import { type User, DEMO_USERS } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAs: (userId: string) => void;
  loginWithCredentials: (email: string) => boolean;
  switchProfile: (userId: string) => void;
  logout: () => void;
  canEdit: () => boolean;
  canAdmin: () => boolean;
}

const STORAGE_KEY = "nexus-pulse-auth-user";

export const useAuthStore = create<AuthState>((set, get) => {
  // Try to recover user from localStorage if running on client
  let initialUser: User | null = DEMO_USERS[0];
  if (typeof window !== "undefined") {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId) {
        const found = DEMO_USERS.find((u) => u.id === savedId);
        if (found) initialUser = found;
      }
    } catch {
      // Storage unavailable
    }
  }

  return {
    user: initialUser,
    isAuthenticated: initialUser !== null,

    loginAs: (userId: string) => {
      const targetUser = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0];
      set({ user: targetUser, isAuthenticated: true });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, targetUser.id);
        } catch {}
      }
    },

    loginWithCredentials: (email: string) => {
      const targetUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      ) || DEMO_USERS[0]; // fallback to default demo user

      set({ user: targetUser, isAuthenticated: true });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, targetUser.id);
        } catch {}
      }
      return true;
    },

    switchProfile: (userId: string) => {
      const targetUser = DEMO_USERS.find((u) => u.id === userId);
      if (targetUser) {
        set({ user: targetUser, isAuthenticated: true });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, targetUser.id);
          } catch {}
        }
      }
    },

    logout: () => {
      set({ user: null, isAuthenticated: false });
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      }
    },

    canEdit: () => {
      const currentUser = get().user;
      return currentUser !== null && currentUser.role !== "viewer";
    },

    canAdmin: () => {
      const currentUser = get().user;
      return currentUser !== null && currentUser.role === "admin";
    },
  };
});
