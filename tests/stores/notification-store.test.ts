import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationStore } from "@/stores/notification-store";

describe("Notification Store with Workflow Alerts & History", () => {
  beforeEach(() => {
    useNotificationStore.getState().clearAll();
    useNotificationStore.getState().clearHistory();
  });

  it("should support workflow notification type and update unreadCount", () => {
    const store = useNotificationStore.getState();
    expect(store.notifications).toHaveLength(0);
    expect(store.history).toHaveLength(0);
    expect(store.unreadCount).toBe(0);

    store.showNotification(
      "workflow",
      "⚡ Workflow: Notificación In-App",
      "Tarea NP-101 completada con éxito."
    );

    const updated = useNotificationStore.getState();
    expect(updated.notifications).toHaveLength(1);
    expect(updated.notifications[0].type).toBe("workflow");
    expect(updated.notifications[0].title).toBe("⚡ Workflow: Notificación In-App");

    expect(updated.history).toHaveLength(1);
    expect(updated.history[0].type).toBe("workflow");
    expect(updated.unreadCount).toBe(1);
  });

  it("should mark all as read and clear history", () => {
    const store = useNotificationStore.getState();
    store.showNotification("workflow", "Alerta 1", "Mensaje 1");
    store.showNotification("success", "Alerta 2", "Mensaje 2");

    expect(useNotificationStore.getState().unreadCount).toBe(2);
    expect(useNotificationStore.getState().history).toHaveLength(2);

    useNotificationStore.getState().markAllAsRead();
    expect(useNotificationStore.getState().unreadCount).toBe(0);
    expect(useNotificationStore.getState().history.every((n) => n.read)).toBe(true);

    useNotificationStore.getState().clearHistory();
    expect(useNotificationStore.getState().history).toHaveLength(0);
  });
});
