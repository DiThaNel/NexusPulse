import { describe, it, expect } from "vitest";
import {
  triggerTaskWorkflows,
  getServerWorkflows,
  toggleServerWorkflowStatus,
} from "@/lib/server-workflows";
import { Task, DEMO_USERS } from "@/types";

describe("Server Workflow Trigger Engine", () => {
  const dummyTask: Task = {
    id: "NP-TEST-1",
    title: "Implementar autenticación WebAuthn",
    description: "Configurar passkeys para acceso rápido biométrico.",
    status: "done",
    priority: "high",
    assignee: DEMO_USERS[0],
    tags: ["auth", "security"],
    estimateHours: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("should trigger active workflows listening to 'done' when task is completed", async () => {
    const results = await triggerTaskWorkflows(dummyTask);

    expect(results.length).toBeGreaterThan(0);
    const inAppTrigger = results.find((r) => r.workflowId === "wf-5");
    expect(inAppTrigger).toBeDefined();
    expect(inAppTrigger?.actionType).toBe("in_app_notification");
    expect(inAppTrigger?.taskId).toBe("NP-TEST-1");
    expect(inAppTrigger?.title).toContain("Workflow");

    // Check that workflow runsCount incremented and logs were generated
    const workflows = await getServerWorkflows();
    const wf5 = workflows.find((w) => w.id === "wf-5");
    expect(wf5?.runsCount).toBeGreaterThan(0);
    expect(wf5?.lastRunAt).toBe("Justo ahora");
    expect(wf5?.recentLogs && wf5.recentLogs.length).toBeGreaterThan(0);
  });

  it("should NOT trigger paused workflows when task is completed", async () => {
    // Pause wf-5
    await toggleServerWorkflowStatus("wf-5");

    const workflowsBefore = await getServerWorkflows();
    const wf5Paused = workflowsBefore.find((w) => w.id === "wf-5");
    expect(wf5Paused?.status).toBe("paused");
    const countBefore = wf5Paused?.runsCount || 0;

    // Trigger task workflows
    const results = await triggerTaskWorkflows(dummyTask);
    const inAppTrigger = results.find((r) => r.workflowId === "wf-5");
    expect(inAppTrigger).toBeUndefined();

    // Verify count did not increment
    const workflowsAfter = await getServerWorkflows();
    const wf5After = workflowsAfter.find((w) => w.id === "wf-5");
    expect(wf5After?.runsCount).toBe(countBefore);

    // Re-activate wf-5 for subsequent tests/app usage
    await toggleServerWorkflowStatus("wf-5");
    const workflowsRestored = await getServerWorkflows();
    expect(workflowsRestored.find((w) => w.id === "wf-5")?.status).toBe("active");
  });
});
