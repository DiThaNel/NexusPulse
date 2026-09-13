import { describe, it, expect } from "vitest";
import { workflowSchema } from "@/lib/validations/workflow";

describe("Workflow Schema Validation (Zod)", () => {
  it("should validate a correct workflow configuration", () => {
    const validWorkflow = {
      name: "Deploy a Producción Vercel",
      description: "Pipeline automatizado al aprobar la tarea en Kanban",
      trigger: "event",
      triggerDetail: "task.status == 'done'",
      actionType: "github_deploy",
      actionLabel: "Disparar deploy en Edge Vercel",
      status: "active",
    };

    const result = workflowSchema.safeParse(validWorkflow);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Deploy a Producción Vercel");
      expect(result.data.trigger).toBe("event");
      expect(result.data.actionType).toBe("github_deploy");
      expect(result.data.status).toBe("active");
    }
  });

  it("should reject workflow with invalid trigger type", () => {
    const invalidWorkflow = {
      name: "Workflow Incorrecto",
      description: "Descripción de prueba",
      trigger: "bluetooth_signal", // Invalid
      triggerDetail: "0 0 * * *",
      actionType: "slack_notify",
      actionLabel: "Notificar en Slack",
    };

    const result = workflowSchema.safeParse(invalidWorkflow);
    expect(result.success).toBe(false);
  });

  it("should enforce character constraints on name and description", () => {
    const shortName = {
      name: "No", // < 3 chars
      description: "12345",
      trigger: "webhook",
      triggerDetail: "POST /webhook",
      actionType: "slack_notify",
      actionLabel: "Alerta Slack",
    };

    const resultShort = workflowSchema.safeParse(shortName);
    expect(resultShort.success).toBe(false);

    const longDescription = {
      name: "Nombre Válido",
      description: "D".repeat(165), // > 160 chars
      trigger: "webhook",
      triggerDetail: "POST /webhook",
      actionType: "slack_notify",
      actionLabel: "Alerta Slack",
    };

    const resultLong = workflowSchema.safeParse(longDescription);
    expect(resultLong.success).toBe(false);
  });

  it("should default status to 'active' if omitted", () => {
    const workflowWithoutStatus = {
      name: "Auto Archivar Tareas",
      description: "Mover tareas completadas hace más de 30 días",
      trigger: "cron",
      triggerDetail: "0 0 1 * *",
      actionType: "database_archive",
      actionLabel: "Archivar registros en cold storage",
    };

    const result = workflowSchema.safeParse(workflowWithoutStatus);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("active");
    }
  });
});
