import { create } from "zustand";
import { type User, DEMO_USERS } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isSyncing: boolean;
  loginAs: (userId: string) => Promise<void>;
  loginWithCredentials: (email: string) => Promise<boolean>;
  switchProfile: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
  canEdit: () => boolean;
  canAdmin: () => boolean;
  syncSessionFromServer: () => Promise<void>;
}

const STORAGE_KEY = "nexus-pulse-auth-user";

async function setServerCookie(userId?: string, email?: string) {
  try {
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email }),
    });
  } catch {
    // Network or SSR silent fallback
  }
}

async function clearServerCookie() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  } catch {}
}

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
      // Ensure initial cookie is synced for default demo session
      if (initialUser) {
        setServerCookie(initialUser.id);
      }
    } catch {
      // Storage unavailable
    }
  }

  return {
    user: initialUser,
    isAuthenticated: initialUser !== null,
    isSyncing: false,

    loginAs: async (userId: string) => {
      const targetUser = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0];
      set({ user: targetUser, isAuthenticated: true });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, targetUser.id);
        } catch {}
      }
      await setServerCookie(targetUser.id);
    },

    loginWithCredentials: async (email: string) => {
      const targetUser =
        DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        ) || DEMO_USERS[0]; // fallback to default demo user

      set({ user: targetUser, isAuthenticated: true });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, targetUser.id);
        } catch {}
      }
      await setServerCookie(undefined, targetUser.email);
      return true;
    },

    switchProfile: async (userId: string) => {
      const targetUser = DEMO_USERS.find((u) => u.id === userId);
      if (targetUser) {
        set({ user: targetUser, isAuthenticated: true });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, targetUser.id);
          } catch {}
        }
        await setServerCookie(targetUser.id);
      }
    },

    logout: async () => {
      set({ user: null, isAuthenticated: false });
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      }
      await clearServerCookie();
    },

    canEdit: () => {
      const currentUser = get().user;
      return currentUser !== null && currentUser.role !== "viewer";
    },

    canAdmin: () => {
      const currentUser = get().user;
      return currentUser !== null && currentUser.role === "admin";
    },

    syncSessionFromServer: async () => {
      try {
        set({ isSyncing: true });
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            set({ user: data.user, isAuthenticated: true });
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(STORAGE_KEY, data.user.id);
              } catch {}
            }
          } else {
            set({ user: null, isAuthenticated: false });
            if (typeof window !== "undefined") {
              try {
                localStorage.removeItem(STORAGE_KEY);
              } catch {}
            }
          }
        }
      } catch {
        // Fallback to local
      } finally {
        set({ isSyncing: false });
      }
    },
  };
});
