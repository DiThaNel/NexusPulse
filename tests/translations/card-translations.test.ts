import { describe, it, expect } from "vitest";
import {
  localizeTask,
  localizeWorkflow,
  localizeTimeAgo,
  localizeNotification,
} from "@/lib/translations/card-translations";
import { Task, Workflow } from "@/types";

describe("Card Localization Engine (card-translations)", () => {
  const sampleSeedTask: Task = {
    id: "NP-101",
    title: "Diseñar arquitectura de tokens HSL y Dark/Light Mode",
    description: "Configurar variables semánticas en globals.css y ThemeProvider sin flash de hidratación.",
    status: "done",
    priority: "urgent",
    tags: ["architecture", "design-system"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleCustomTask: Task = {
    id: "NP-CUSTOM-999",
    title: "Mi tarea personalizada en español",
    description: "Detalles que el usuario ingresó manualmente",
    status: "todo",
    priority: "low",
    tags: ["custom"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("should return localized task title and description in English for seed tasks", () => {
    const localizedEn = localizeTask(sampleSeedTask, "en");
    expect(localizedEn.title).toBe("Design HSL Token Architecture & Dark/Light Mode");
    expect(localizedEn.description).toBe(
      "Configure semantic variables in globals.css and ThemeProvider with zero hydration flash."
    );
  });

  it("should return localized task in Spanish for seed tasks", () => {
    const localizedEs = localizeTask(sampleSeedTask, "es");
    expect(localizedEs.title).toBe("Diseñar arquitectura de tokens HSL y Dark/Light Mode");
  });

  it("should preserve custom user-created tasks without overwriting their text", () => {
    const customEn = localizeTask(sampleCustomTask, "en");
    expect(customEn.title).toBe("Mi tarea personalizada en español");
    expect(customEn.description).toBe("Detalles que el usuario ingresó manualmente");

    const customEs = localizeTask(sampleCustomTask, "es");
    expect(customEs.title).toBe("Mi tarea personalizada en español");
  });

  it("should localize workflow names, descriptions, and relative time", () => {
    const sampleWorkflow: Workflow = {
      id: "wf-1",
      name: "GitHub Sync & Deploy Trigger",
      description:
        "Sincroniza commits de la rama main, ejecuta verificación de tests y dispara el despliegue automático a producción.",
      trigger: "webhook",
      triggerDetail: "push:refs/heads/main",
      status: "active",
      runsCount: 100,
      successRate: 99.9,
      lastRunAt: "Hace 4 minutos",
      steps: [
        {
          id: "step-1-1",
          name: "Receptor de Webhook Entrante",
          type: "trigger",
          configLabel: "POST /webhook",
        },
      ],
    };

    const wfEn = localizeWorkflow(sampleWorkflow, "en");
    expect(wfEn.description).toBe(
      "Syncs commits from main branch, executes test suite verification, and triggers automated production deployment."
    );
    expect(wfEn.lastRunAt).toBe("4 minutes ago");
    expect(wfEn.steps[0].name).toBe("Inbound Webhook Receiver");

    const wfEs = localizeWorkflow(sampleWorkflow, "es");
    expect(wfEs.lastRunAt).toBe("Hace 4 minutos");
    expect(wfEs.steps[0].name).toBe("Receptor de Webhook Entrante");
  });

  describe("localizeNotification", () => {
    it("should translate Spanish notifications into English", () => {
      const notifEs = {
        id: "notif-1",
        title: "Rollback Automático Activado",
        message: "El servidor simuló un fallo de red. La tarea regresó instantáneamente a su columna original.",
        type: "rollback" as const,
        timestamp: Date.now(),
        read: false,
      };

      const notifEn = localizeNotification(notifEs, "en");
      expect(notifEn.title).toBe("Automatic Rollback Triggered");
      expect(notifEn.message).toBe("The server simulated a network error. Task was restored to its original column.");
    });

    it("should translate English notifications into Spanish", () => {
      const notifEn = {
        id: "notif-2",
        title: "Synchronized with Server",
        message: "Change persisted in backend via TanStack Query.",
        type: "success" as const,
        timestamp: Date.now(),
        read: false,
      };

      const notifEs = localizeNotification(notifEn, "es");
      expect(notifEs.title).toBe("Sincronizado con el Servidor");
      expect(notifEs.message).toBe("Cambio persistido en el backend a través de TanStack Query.");
    });

    it("should translate workflow trigger notifications bidirectionally", () => {
      const wfNotifEs = {
        id: "notif-3",
        title: "⚡ Workflow: Notificación In-App al Completar Tarea",
        message: 'La tarea "Diseñar arquitectura de tokens HSL" fue completada. Automatización ejecutada con éxito.',
        type: "workflow" as const,
        timestamp: Date.now(),
        read: false,
      };

      const wfNotifEn = localizeNotification(wfNotifEs, "en");
      expect(wfNotifEn.title).toBe("⚡ Workflow: In-App Alert on Task Completion");
      expect(wfNotifEn.message).toBe('Task "Design HSL Token Architecture" was completed. Automation executed successfully.');

      const backToEs = localizeNotification(wfNotifEn, "es");
      expect(backToEs.title).toBe("⚡ Workflow: Notificación In-App al Completar Tarea");
      expect(backToEs.message).toBe('La tarea "Diseñar arquitectura de tokens HSL" fue completada. Automatización ejecutada con éxito.');
    });
  });
});

