import { Task, Workflow } from "@/types";

export interface BilingualText {
  es: string;
  en: string;
}

export interface TaskTranslation {
  title: BilingualText;
  description: BilingualText;
  tags?: {
    es: string[];
    en: string[];
  };
}

export interface WorkflowTranslation {
  name: BilingualText;
  description: BilingualText;
  lastRunAt?: BilingualText;
  steps?: Record<
    string,
    {
      name: BilingualText;
      configLabel?: BilingualText;
    }
  >;
}

export const TASK_TRANSLATIONS: Record<string, TaskTranslation> = {
  "NP-101": {
    title: {
      es: "Diseñar arquitectura de tokens HSL y Dark/Light Mode",
      en: "Design HSL Token Architecture & Dark/Light Mode",
    },
    description: {
      es: "Configurar variables semánticas en globals.css y ThemeProvider sin flash de hidratación.",
      en: "Configure semantic variables in globals.css and ThemeProvider with zero hydration flash.",
    },
    tags: {
      es: ["arquitectura", "design-system"],
      en: ["architecture", "design-system"],
    },
  },
  "NP-102": {
    title: {
      es: "Construir Shell de la aplicación y Command Palette (⌘K)",
      en: "Build Application Shell & Command Palette (⌘K)",
    },
    description: {
      es: "Implementar sidebar colapsable, breadcrumbs dinámicos y modal de búsqueda con cmdk.",
      en: "Implement collapsible sidebar, dynamic breadcrumbs, and search modal with cmdk.",
    },
    tags: {
      es: ["shell", "cmdk", "navegacion"],
      en: ["shell", "cmdk", "navigation"],
    },
  },
  "NP-103": {
    title: {
      es: "Implementar sistema de Drag & Drop con @dnd-kit",
      en: "Implement Drag & Drop System with @dnd-kit",
    },
    description: {
      es: "Orquestar columnas reordenables, sensores accesibles y animaciones fluidas.",
      en: "Orchestrate reorderable columns, accessible sensors, and fluid animations.",
    },
    tags: {
      es: ["kanban", "dnd-kit", "frontend"],
      en: ["kanban", "dnd-kit", "frontend"],
    },
  },
  "NP-104": {
    title: {
      es: "Integrar validaciones de seguridad y sanitización con Zod",
      en: "Integrate Security Validations & Sanitization with Zod",
    },
    description: {
      es: "Prevenir inyecciones maliciosas y validar esquemas de datos en tiempo de ejecución.",
      en: "Prevent malicious injections and validate runtime data schemas.",
    },
    tags: {
      es: ["seguridad", "zod", "typesafe"],
      en: ["security", "zod", "typesafe"],
    },
  },
  "NP-105": {
    title: {
      es: "Conectar mutaciones optimistas con TanStack Query",
      en: "Connect Optimistic Mutations with TanStack Query",
    },
    description: {
      es: "Garantizar respuesta instantánea en la UI con rollback automático si falla el servidor.",
      en: "Ensure instantaneous UI feedback with automatic server rollback on network failure.",
    },
    tags: {
      es: ["react-query", "async", "cache"],
      en: ["react-query", "async", "cache"],
    },
  },
  "NP-106": {
    title: {
      es: "Diseñar telemetría y gráficos interactivos de rendimiento",
      en: "Design Interactive Performance Metrics & Telemetry",
    },
    description: {
      es: "Crear componentes de métricas visuales con SVG zero-hydration y animaciones elásticas.",
      en: "Create visual analytics components with zero-hydration SVG and spring physics.",
    },
    tags: {
      es: ["analiticas", "graficos"],
      en: ["analytics", "charts"],
    },
  },
  "NP-107": {
    title: {
      es: "Automatizar suite de pruebas unitarias con Vitest y RTL",
      en: "Automate Unit Testing Suite with Vitest & RTL",
    },
    description: {
      es: "Alcanzar cobertura de código sobre custom hooks, stores de Zustand y componentes atómicos.",
      en: "Achieve high test coverage across custom hooks, Zustand stores, and atomic components.",
    },
    tags: {
      es: ["testing", "vitest", "ci-cd"],
      en: ["testing", "vitest", "ci-cd"],
    },
  },
};

export const WORKFLOW_TRANSLATIONS: Record<string, WorkflowTranslation> = {
  "wf-1": {
    name: {
      es: "GitHub Sync & Deploy Trigger",
      en: "GitHub Sync & Deploy Trigger",
    },
    description: {
      es: "Sincroniza commits de la rama main, ejecuta verificación de tests y dispara el despliegue automático a producción.",
      en: "Syncs commits from main branch, executes test suite verification, and triggers automated production deployment.",
    },
    lastRunAt: {
      es: "Hace 4 minutos",
      en: "4 minutes ago",
    },
    steps: {
      "step-1-1": {
        name: {
          es: "Receptor de Webhook Entrante",
          en: "Inbound Webhook Receiver",
        },
      },
      "step-1-2": {
        name: {
          es: "Evaluador de Rama & Tests",
          en: "Branch & Test Evaluator",
        },
      },
      "step-1-3": {
        name: {
          es: "Despachador de Deploy a Producción",
          en: "Production Deploy Dispatcher",
        },
      },
    },
  },
  "wf-2": {
    name: {
      es: "Kanban Task SLA Escalation",
      en: "Kanban Task SLA Escalation",
    },
    description: {
      es: "Monitorea tareas en 'En Progreso'. Si una tarea crítica excede 48 horas sin actualización, escala una alerta a Slack y reasigna.",
      en: "Monitors tasks in 'In Progress'. If a critical task exceeds 48 hours without update, escalates a Slack alert and reassigns.",
    },
    lastRunAt: {
      es: "Hace 2 horas",
      en: "2 hours ago",
    },
    steps: {
      "step-2-1": {
        name: {
          es: "Escucha de SLA de Tareas",
          en: "Task SLA Monitor Listener",
        },
      },
      "step-2-2": {
        name: {
          es: "Verificación de Severidad",
          en: "Severity Check",
        },
      },
      "step-2-3": {
        name: {
          es: "Alerta & Etiquetado en Slack Ops",
          en: "Slack Ops Alert & Tagging",
        },
      },
    },
  },
  "wf-3": {
    name: {
      es: "Daily Security & Audit Sweep",
      en: "Daily Security & Audit Sweep",
    },
    description: {
      es: "Escaneo automatizado diario de dependencias vulnerables (npm audit) y reporte de seguridad a Sentry.",
      en: "Daily automated scan for vulnerable dependencies (npm audit) and security reporting to Sentry.",
    },
    lastRunAt: {
      es: "Hace 14 horas",
      en: "14 hours ago",
    },
    steps: {
      "step-3-1": {
        name: {
          es: "Disparador Programado Cron",
          en: "Scheduled Cron Trigger",
        },
      },
      "step-3-2": {
        name: {
          es: "Auditoría de Vulnerabilidades npm",
          en: "npm Vulnerability Audit",
        },
      },
      "step-3-3": {
        name: {
          es: "Despacho de Reporte a Sentry & SecOps",
          en: "Sentry & SecOps Report Dispatch",
        },
      },
    },
  },
  "wf-4": {
    name: {
      es: "TanStack Optimistic Rollback Monitor",
      en: "TanStack Optimistic Rollback Monitor",
    },
    description: {
      es: "Registra fallos simulados y verifica la consistencia de caché entre cliente Zustand y servidor TanStack Query.",
      en: "Logs simulated network failures and verifies cache consistency between client Zustand and TanStack Query server.",
    },
    lastRunAt: {
      es: "Hace 1 día",
      en: "1 day ago",
    },
    steps: {
      "step-4-1": {
        name: {
          es: "Detector de Mutación Kanban",
          en: "Kanban Mutation Detector",
        },
      },
      "step-4-2": {
        name: {
          es: "Evaluador de Fallo Simulado",
          en: "Simulated Error Evaluator",
        },
      },
      "step-4-3": {
        name: {
          es: "Verificador de Consistencia de Caché",
          en: "Cache Consistency Verifier",
        },
      },
    },
  },
};

/**
 * Localizes a Kanban Task.
 * Returns translated title, description, and tags if it is a seed task,
 * or safely preserves user-created/custom content.
 */
export function localizeTask(task: Task, locale: "es" | "en"): Task {
  const trans = TASK_TRANSLATIONS[task.id];
  if (!trans) return task;

  return {
    ...task,
    title: trans.title[locale] || task.title,
    description: trans.description[locale] || task.description,
    tags: trans.tags ? trans.tags[locale] || task.tags : task.tags,
  };
}

/**
 * Localizes a Workflow.
 * Returns translated name, description, steps, and relative timestamp.
 */
export function localizeWorkflow(workflow: Workflow, locale: "es" | "en"): Workflow {
  const trans = WORKFLOW_TRANSLATIONS[workflow.id];
  if (!trans) return workflow;

  return {
    ...workflow,
    name: trans.name[locale] || workflow.name,
    description: trans.description[locale] || workflow.description,
    lastRunAt: trans.lastRunAt ? trans.lastRunAt[locale] || workflow.lastRunAt : workflow.lastRunAt,
    steps: workflow.steps.map((step) => {
      const stepTrans = trans.steps?.[step.id];
      if (!stepTrans) return step;
      return {
        ...step,
        name: stepTrans.name[locale] || step.name,
        configLabel: stepTrans.configLabel?.[locale] || step.configLabel,
      };
    }),
  };
}

/**
 * Localizes relative timestamps like "Hace 4 minutos" -> "4 minutes ago"
 */
export function localizeTimeAgo(timeStr: string | undefined, locale: "es" | "en"): string {
  if (!timeStr) return locale === "en" ? "Never" : "Nunca";
  if (locale === "es") return timeStr;

  if (/^Hace\s+1\s+día/i.test(timeStr)) return "1 day ago";
  if (/^Hace\s+1\s+hora/i.test(timeStr)) return "1 hour ago";
  if (/^Hace\s+1\s+minuto/i.test(timeStr)) return "1 minute ago";

  return timeStr
    .replace(/^Hace\s+(\d+)\s+minutos?/i, "$1 minutes ago")
    .replace(/^Hace\s+(\d+)\s+horas?/i, "$1 hours ago")
    .replace(/^Hace\s+(\d+)\s+días?/i, "$1 days ago")
    .replace(/^Nunca$/i, "Never");
}
