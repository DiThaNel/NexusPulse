import { describe, it, expect } from "vitest";
import {
  localizeTask,
  localizeWorkflow,
  localizeTimeAgo,
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

  describe("localizeTimeAgo", () => {
    it("should translate Spanish relative time strings into English", () => {
      expect(localizeTimeAgo("Hace 4 minutos", "en")).toBe("4 minutes ago");
      expect(localizeTimeAgo("Hace 2 horas", "en")).toBe("2 hours ago");
      expect(localizeTimeAgo("Hace 1 día", "en")).toBe("1 day ago");
      expect(localizeTimeAgo("Nunca", "en")).toBe("Never");
      expect(localizeTimeAgo(undefined, "en")).toBe("Never");
    });

    it("should keep Spanish strings unchanged when locale is 'es'", () => {
      expect(localizeTimeAgo("Hace 4 minutos", "es")).toBe("Hace 4 minutos");
      expect(localizeTimeAgo("Hace 2 horas", "es")).toBe("Hace 2 horas");
      expect(localizeTimeAgo(undefined, "es")).toBe("Nunca");
    });
  });
});
