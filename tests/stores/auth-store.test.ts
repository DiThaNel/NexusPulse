import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/stores/auth-store";
import { DEMO_USERS } from "@/types";

// Mock fetch globally for auth tests
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ authenticated: true }),
  } as Response)
);

describe("Auth Store & RBAC Permissions (Zustand)", () => {
  beforeEach(() => {
    // Reset to admin demo user
    useAuthStore.setState({
      user: DEMO_USERS[0], // admin
      isAuthenticated: true,
      isSyncing: false,
    });
  });

  it("should allow editing for 'admin' and 'product_manager' roles", () => {
    // Admin
    useAuthStore.setState({ user: DEMO_USERS[0] });
    expect(useAuthStore.getState().canEdit()).toBe(true);
    expect(useAuthStore.getState().canAdmin()).toBe(true);

    // Product Manager
    useAuthStore.setState({ user: DEMO_USERS[1] });
    expect(useAuthStore.getState().canEdit()).toBe(true);
    expect(useAuthStore.getState().canAdmin()).toBe(false);
  });

  it("should disallow editing for 'viewer' role (Read-Only Guard)", () => {
    // Viewer
    useAuthStore.setState({ user: DEMO_USERS[2] });
    expect(useAuthStore.getState().canEdit()).toBe(false);
    expect(useAuthStore.getState().canAdmin()).toBe(false);
  });

  it("should disallow editing when not authenticated", () => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    expect(useAuthStore.getState().canEdit()).toBe(false);
    expect(useAuthStore.getState().canAdmin()).toBe(false);
  });

  it("should switch profiles cleanly", async () => {
    await useAuthStore.getState().switchProfile(DEMO_USERS[2].id);
    expect(useAuthStore.getState().user?.id).toBe(DEMO_USERS[2].id);
    expect(useAuthStore.getState().canEdit()).toBe(false);
  });

  it("should logout and clear authentication state", async () => {
    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().canEdit()).toBe(false);
  });
});
