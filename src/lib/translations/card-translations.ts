import { Task, Workflow, WorkflowRunLog, TelemetryLog } from "@/types";

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
      es: "Disparador de Sincronización & Despliegue con GitHub",
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
      es: "Escalamiento de SLA de Tareas Kanban",
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
      es: "Verificación Diaria de Operaciones & Salud",
      en: "Daily Operations Health Check",
    },
    description: {
      es: "Rutina cron diaria de verificación de salud de la plataforma, integridad de datos y cálculo de telemetría de rendimiento.",
      en: "Daily cron routine for platform health checks, data integrity audits, and performance telemetry aggregation.",
    },
    lastRunAt: {
      es: "Ayer a las 00:00",
      en: "Yesterday at 00:00",
    },
    steps: {
      "step-3-1": {
        name: {
          es: "Disparador Cron de Medianoche",
          en: "Midnight Cron Trigger",
        },
      },
      "step-3-2": {
        name: {
          es: "Salud de Latencia & Rendimiento",
          en: "Latency & Throughput Health",
        },
      },
      "step-3-3": {
        name: {
          es: "Generación de Instantánea de Telemetría",
          en: "Telemetry Snapshot Generation",
        },
      },
    },
  },
  "wf-4": {
    name: {
      es: "Archivado de Telemetría de Tareas Completadas",
      en: "Done Task Telemetry Archival",
    },
    description: {
      es: "Archiva métricas y tiempos de ciclo cuando una tarea pasa a 'Completado' con etiquetas de archivo.",
      en: "Archives metrics and cycle times when a task moves to 'Done' with archival tags.",
    },
    lastRunAt: {
      es: "Hace 2 días",
      en: "2 days ago",
    },
    steps: {
      "step-4-1": {
        name: {
          es: "Escucha de Tarea Completada",
          en: "Task Completed Listener",
        },
      },
      "step-4-2": {
        name: {
          es: "Validador de Filtro de Etiquetas",
          en: "Tag Filter Validator",
        },
      },
      "step-4-3": {
        name: {
          es: "Escritor en Base de Datos de Archivo",
          en: "Archive Database Writer",
        },
      },
    },
  },
  "wf-5": {
    name: {
      es: "Notificación In-App al Completar Tarea",
      en: "In-App Alert on Task Completion",
    },
    description: {
      es: "Monitorea eventos del Kanban. Cuando una tarea pasa a 'Completado', emite una alerta visual en la aplicación y registra telemetría operativa.",
      en: "Monitors Kanban events. When a task is moved to 'Done', triggers a visual in-app notification and logs operational telemetry.",
    },
    lastRunAt: {
      es: "Hace 10 minutos",
      en: "10 minutes ago",
    },
    steps: {
      "step-5-1": {
        name: {
          es: "Escucha de Tareas Completadas",
          en: "Task Completed Listener",
        },
      },
      "step-5-2": {
        name: {
          es: "Guardia de Workflow & Seguridad",
          en: "Active Workflow & Security Guard",
        },
      },
      "step-5-3": {
        name: {
          es: "Despachador Reactivo In-App",
          en: "In-App Reactive Dispatcher",
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
 * Localizes relative timestamps bidirectionally (ES <-> EN).
 */
export function localizeTimeAgo(timeStr: string | undefined, locale: "es" | "en"): string {
  if (!timeStr) return locale === "en" ? "Never" : "Nunca";

  if (locale === "en") {
    if (/^Justo\s+ahora$/i.test(timeStr)) return "Just now";
    if (/^Ayer\s+a\s+las\s+(\d{2}:\d{2})/i.test(timeStr)) {
      return timeStr.replace(/^Ayer\s+a\s+las\s+(\d{2}:\d{2})/i, "Yesterday at $1");
    }
    if (/^Hace\s+1\s+día/i.test(timeStr)) return "1 day ago";
    if (/^Hace\s+1\s+hora/i.test(timeStr)) return "1 hour ago";
    if (/^Hace\s+1\s+minuto/i.test(timeStr)) return "1 minute ago";
    if (/^Hace\s+(\d+)\s+minutos?/i.test(timeStr)) {
      return timeStr.replace(/^Hace\s+(\d+)\s+minutos?/i, "$1 minutes ago");
    }
    if (/^Hace\s+(\d+)\s+horas?/i.test(timeStr)) {
      return timeStr.replace(/^Hace\s+(\d+)\s+horas?/i, "$1 hours ago");
    }
    if (/^Hace\s+(\d+)\s+días?/i.test(timeStr)) {
      return timeStr.replace(/^Hace\s+(\d+)\s+días?/i, "$1 days ago");
    }
    if (/^Nunca$/i.test(timeStr)) return "Never";
    return timeStr;
  }

  // locale === "es"
  if (/^Just\s+now$/i.test(timeStr)) return "Justo ahora";
  if (/^Yesterday\s+at\s+(\d{2}:\d{2})/i.test(timeStr)) {
    return timeStr.replace(/^Yesterday\s+at\s+(\d{2}:\d{2})/i, "Ayer a las $1");
  }
  if (/^1\s+day\s+ago/i.test(timeStr)) return "Hace 1 día";
  if (/^1\s+hour\s+ago/i.test(timeStr)) return "Hace 1 hora";
  if (/^1\s+minute\s+ago/i.test(timeStr)) return "Hace 1 minuto";
  if (/^(\d+)\s+minutes?\s+ago/i.test(timeStr)) {
    return timeStr.replace(/^(\d+)\s+minutes?\s+ago/i, "Hace $1 minutos");
  }
  if (/^(\d+)\s+hours?\s+ago/i.test(timeStr)) {
    return timeStr.replace(/^(\d+)\s+hours?\s+ago/i, "Hace $1 horas");
  }
  if (/^(\d+)\s+days?\s+ago/i.test(timeStr)) {
    return timeStr.replace(/^(\d+)\s+days?\s+ago/i, "Hace $1 días");
  }
  if (/^Never$/i.test(timeStr)) return "Nunca";
  return timeStr;
}

/**
 * Localizes a Workflow.
 * Returns translated name, description, steps, and relative timestamp.
 */
export function localizeWorkflow(workflow: Workflow, locale: "es" | "en"): Workflow {
  const trans = WORKFLOW_TRANSLATIONS[workflow.id];
  const localizedLastRun = localizeTimeAgo(workflow.lastRunAt, locale);

  if (!trans) {
    return {
      ...workflow,
      lastRunAt: localizedLastRun,
    };
  }

  return {
    ...workflow,
    name: trans.name[locale] || workflow.name,
    description: trans.description[locale] || workflow.description,
    lastRunAt: localizedLastRun,
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
 * Localizes sequential execution logs inside the Pipeline Drawer.
 */
export function localizeWorkflowRunLog(log: WorkflowRunLog, locale: "es" | "en"): WorkflowRunLog {
  if (locale === "en") {
    const msg = log.message
      .replace(/\[DISPARADOR\]/g, "[TRIGGER]")
      .replace(/\[EVALUACIÓN\]/g, "[EVALUATION]")
      .replace(/\[ACCIÓN\]/g, "[ACTION]")
      .replace(/\[ÉXITO\]/g, "[SUCCESS]")
      .replace(/Verificando fuente:/g, "Verifying source:")
      .replace(/Criterios de CI cumplidos/g, "CI criteria passed")
      .replace(/Despliegue iniciado en Vercel/g, "Deployment initiated on Vercel")
      .replace(/Despliegue completado en/g, "Deployment completed in")
      .replace(/Barrido de tareas activas ejecutado/g, "Active tasks sweep executed")
      .replace(/Prioridad verificada:/g, "Priority verified:")
      .replace(/SLA de 48h sobrepasado/g, "48h SLA exceeded")
      .replace(/Notificación despachada al canal/g, "Notification dispatched to channel")
      .replace(/con éxito/g, "successfully")
      .replace(/Condición de seguridad y datos validada:\s*OK/g, "Security and data condition validated: OK")
      .replace(/Ejecutando:/g, "Executing:")
      .replace(/ejecutado con éxito en/g, "executed successfully in")
      .replace(/Salida:\s*200 OK/g, "Output: 200 OK")
      .replace(/Evento detectado:/g, "Event detected:")
      .replace(/marcada como 'Completado'/g, "marked as 'Done'")
      .replace(/completada/g, "completed")
      .replace(/Workflow activo\. Canal de entrega:/g, "Active workflow. Delivery channel:")
      .replace(/Pipeline completado en/g, "Pipeline completed in")
      .replace(/Notificación emitida para/g, "Notification dispatched to")
      .replace(/Notificación reactiva despachada a la aplicación con éxito/g, "Reactive in-app notification dispatched successfully");
    return { ...log, message: msg };
  } else {
    const msg = log.message
      .replace(/\[TRIGGER\]/g, "[DISPARADOR]")
      .replace(/\[EVALUATION\]/g, "[EVALUACIÓN]")
      .replace(/\[ACTION\]/g, "[ACCIÓN]")
      .replace(/\[SUCCESS\]/g, "[ÉXITO]")
      .replace(/Verifying inbound source:/g, "Verificando fuente entrante:")
      .replace(/Verifying source:/g, "Verificando fuente:")
      .replace(/Rule criteria and data schema validated successfully:\s*OK/g, "Criterios de regla y datos validados con éxito: OK");
    return { ...log, message: msg };
  }
}

/**
 * Localizes Telemetry events for the Live Telemetry Feed in /analytics.
 */
export function localizeTelemetry(log: import("@/types").TelemetryLog, locale: "es" | "en"): import("@/types").TelemetryLog {
  if (locale === "es") {
    let action = log.action;
    switch (log.action) {
      case "TASK_STATUS_CHANGED":
        action = "CAMBIO DE ESTADO";
        break;
      case "TASK_CREATED":
        action = "TAREA CREADA";
        break;
      case "TASK_DELETED":
        action = "TAREA ELIMINADA";
        break;
      case "WORKFLOW_TRIGGERED":
        action = "WORKFLOW DISPARADO";
        break;
      case "WORKFLOW_EXECUTED":
        action = "WORKFLOW EJECUTADO";
        break;
      case "WORKFLOW_STATUS_TOGGLED":
        action = "ESTADO WORKFLOW";
        break;
      case "WORKFLOW_CREATED":
        action = "WORKFLOW CREADO";
        break;
      case "TELEMETRY_CLEARED":
        action = "TELEMETRÍA LIMPIADA";
        break;
      case "ANALYTICS_SNAPSHOT":
        action = "SNAPSHOT ANALÍTICA";
        break;
      case "API_AUTHENTICATION":
        action = "AUTENTICACIÓN API";
        break;
    }

    const target = log.target
      .replace(/in-progress/gi, "en progreso")
      .replace(/in_progress/gi, "en progreso")
      .replace(/backlog/gi, "backlog")
      .replace(/todo/gi, "por hacer")
      .replace(/done/gi, "completado")
      .replace(/→\s*ACTIVE/gi, "→ ACTIVO")
      .replace(/→\s*PAUSED/gi, "→ PAUSADO")
      .replace(/GitHub Sync & Deploy Trigger/gi, "Disparador Sincronización GitHub")
      .replace(/Kanban Task SLA Escalation/gi, "Escalamiento SLA Kanban")
      .replace(/Daily Operations Health Check/gi, "Verificación Operaciones Diaria")
      .replace(/Done Task Telemetry Archival/gi, "Archivado Telemetría Tareas");

    return {
      ...log,
      action,
      target,
    };
  }

  // English
  let action = log.action;
  switch (log.action) {
    case "TASK_STATUS_CHANGED":
      action = "TASK STATUS CHANGED";
      break;
    case "TASK_CREATED":
      action = "TASK CREATED";
      break;
    case "TASK_DELETED":
      action = "TASK DELETED";
      break;
    case "WORKFLOW_TRIGGERED":
      action = "WORKFLOW TRIGGERED";
      break;
    case "WORKFLOW_EXECUTED":
      action = "WORKFLOW EXECUTED";
      break;
    case "WORKFLOW_STATUS_TOGGLED":
      action = "WORKFLOW TOGGLED";
      break;
    case "WORKFLOW_CREATED":
      action = "WORKFLOW CREATED";
      break;
    case "TELEMETRY_CLEARED":
      action = "TELEMETRY CLEARED";
      break;
    case "ANALYTICS_SNAPSHOT":
      action = "ANALYTICS SNAPSHOT";
      break;
    case "API_AUTHENTICATION":
      action = "API AUTHENTICATION";
      break;
  }

  const target = log.target
    .replace(/en progreso/gi, "in-progress")
    .replace(/por hacer/gi, "todo")
    .replace(/completado/gi, "done")
    .replace(/→\s*ACTIVO/gi, "→ ACTIVE")
    .replace(/→\s*PAUSADO/gi, "→ PAUSED")
    .replace(/Notificación In-App al Completar Tarea/gi, "In-App Alert on Task Completion");

  return {
    ...log,
    action,
    target,
  };
}
