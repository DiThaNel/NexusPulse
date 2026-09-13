import { Workflow, WorkflowRunLog, WorkflowStep, Task, TriggeredWorkflowResult } from "@/types";
import { WorkflowInput } from "@/lib/validations/workflow";
import { addServerTelemetry } from "./server-telemetry";

// In-memory seeded database for workflows
let workflowsDb: Workflow[] = [
  {
    id: "wf-1",
    name: "GitHub Sync & Deploy Trigger",
    description: "Sincroniza commits de la rama main, ejecuta verificación de tests y dispara el despliegue automático a producción.",
    trigger: "webhook",
    triggerDetail: "push:refs/heads/main",
    status: "active",
    runsCount: 1420,
    successRate: 99.9,
    lastRunAt: "Hace 4 minutos",
    lastRunStatus: "success",
    steps: [
      {
        id: "step-1-1",
        name: "Webhook Inbound Receiver",
        type: "trigger",
        configLabel: "POST /api/webhooks/github?event=push",
      },
      {
        id: "step-1-2",
        name: "Branch & Test Evaluator",
        type: "condition",
        configLabel: "branch == 'main' && ci_status == 'passed'",
      },
      {
        id: "step-1-3",
        name: "Production Deploy Dispatcher",
        type: "action",
        actionType: "github_deploy",
        configLabel: "Trigger Vercel Edge / Cloud Run (Zero Downtime)",
      },
    ],
    recentLogs: [
      {
        id: "log-1",
        timestamp: "15:02:12",
        level: "info",
        message: "Webhook recibido de GitHub (commit 89f5b57).",
        stepId: "step-1-1",
      },
      {
        id: "log-2",
        timestamp: "15:02:13",
        level: "info",
        message: "Verificando rama de destino: 'main'. Criterios de CI cumplidos.",
        stepId: "step-1-2",
      },
      {
        id: "log-3",
        timestamp: "15:02:14",
        level: "success",
        message: "Despliegue iniciado en Vercel. Despliegue completado en 1.8s.",
        stepId: "step-1-3",
      },
    ],
  },
  {
    id: "wf-2",
    name: "Kanban Task SLA Escalation",
    description: "Monitorea tareas en 'En Progreso'. Si una tarea crítica excede 48 horas sin actualización, escala una alerta a Slack y reasigna.",
    trigger: "event",
    triggerDetail: "task.in_progress > 48h",
    status: "active",
    runsCount: 365,
    successRate: 100,
    lastRunAt: "Hace 2 horas",
    lastRunStatus: "success",
    steps: [
      {
        id: "step-2-1",
        name: "Task SLA Monitor Listener",
        type: "trigger",
        configLabel: "task.status == 'in_progress' && elapsed > 48h",
      },
      {
        id: "step-2-2",
        name: "Severity Check",
        type: "condition",
        configLabel: "task.priority in ['high', 'urgent']",
      },
      {
        id: "step-2-3",
        name: "Slack Ops Alert & Tagging",
        type: "action",
        actionType: "slack_notify",
        configLabel: "Notify #ops-escalations with incident payload",
      },
    ],
    recentLogs: [
      {
        id: "log-2-1",
        timestamp: "13:14:00",
        level: "info",
        message: "Barrido de tareas activas ejecutado. 1 tarea candidata detectada (NP-105).",
        stepId: "step-2-1",
      },
      {
        id: "log-2-2",
        timestamp: "13:14:01",
        level: "info",
        message: "Prioridad verificada: 'urgent'. SLA de 48h sobrepasado.",
        stepId: "step-2-2",
      },
      {
        id: "log-2-3",
        timestamp: "13:14:01",
        level: "success",
        message: "Notificación despachada al canal #ops-escalations con éxito.",
        stepId: "step-2-3",
      },
    ],
  },
  {
    id: "wf-3",
    name: "Daily Operations Health Check",
    description: "Rutina cron diaria de verificación de salud de la plataforma, integridad de datos y cálculo de telemetría de rendimiento.",
    trigger: "cron",
    triggerDetail: "0 0 * * * (00:00 UTC)",
    status: "active",
    runsCount: 840,
    successRate: 98.5,
    lastRunAt: "Ayer a las 00:00",
    lastRunStatus: "success",
    steps: [
      {
        id: "step-3-1",
        name: "Midnight Cron Trigger",
        type: "trigger",
        configLabel: "Cron Schedule: Daily at 00:00 UTC",
      },
      {
        id: "step-3-2",
        name: "Latency & Throughput Health",
        type: "condition",
        configLabel: "All microservices HTTP 200 && p99 < 250ms",
      },
      {
        id: "step-3-3",
        name: "Telemetry Snapshot Generation",
        type: "action",
        actionType: "database_archive",
        configLabel: "Store 24h metrics snapshot into telemetry DB",
      },
    ],
  },
  {
    id: "wf-4",
    name: "Done Task Telemetry Archival",
    description: "Archiva métricas y tiempos de ciclo cuando una tarea pasa a 'Completado' con etiquetas de archivo.",
    trigger: "event",
    triggerDetail: "task.status == 'done'",
    status: "paused",
    runsCount: 52,
    successRate: 99.4,
    lastRunAt: "Hace 2 días",
    lastRunStatus: "idle",
    steps: [
      {
        id: "step-4-1",
        name: "Task Completed Listener",
        type: "trigger",
        configLabel: "Event: kanban.task.moved_to_done",
      },
      {
        id: "step-4-2",
        name: "Tag Filter Validator",
        type: "condition",
        configLabel: "task.tags.includes('archival')",
      },
      {
        id: "step-4-3",
        name: "Archive Database Writer",
        type: "action",
        actionType: "database_archive",
        configLabel: "Export payload to long-term storage",
      },
    ],
  },
  {
    id: "wf-5",
    name: "Notificación In-App al Completar Tarea",
    description: "Monitorea eventos del Kanban. Cuando una tarea pasa a 'Completado', emite una alerta visual en la aplicación y registra telemetría operativa.",
    trigger: "event",
    triggerDetail: "task.status == 'done'",
    status: "active",
    runsCount: 18,
    successRate: 100,
    lastRunAt: "Hace 10 minutos",
    lastRunStatus: "success",
    steps: [
      {
        id: "step-5-1",
        name: "Kanban Task Completed Listener",
        type: "trigger",
        configLabel: "Event: kanban.task.status_changed (target: 'done')",
      },
      {
        id: "step-5-2",
        name: "Active Workflow & Security Guard",
        type: "condition",
        configLabel: "workflow.status == 'active' && task.id != null",
      },
      {
        id: "step-5-3",
        name: "In-App Reactive Dispatcher",
        type: "action",
        actionType: "in_app_notification",
        configLabel: "Dispatch high-priority in-app toast & notification center alert",
      },
    ],
    recentLogs: [
      {
        id: "log-5-1",
        timestamp: "04:10:12",
        level: "info",
        message: "Escuchador de eventos Kanban activo: Esperando tareas completadas.",
        stepId: "step-5-1",
      },
      {
        id: "log-5-2",
        timestamp: "04:10:13",
        level: "info",
        message: "Condición de ejecución verificada: Workflow activo y payload de tarea válido.",
        stepId: "step-5-2",
      },
      {
        id: "log-5-3",
        timestamp: "04:10:13",
        level: "success",
        message: "Notificación reactiva despachada a la aplicación con éxito.",
        stepId: "step-5-3",
      },
    ],
  },
];

// Simulated network latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getServerWorkflows(filters?: {
  search?: string;
  status?: string;
  trigger?: string;
}): Promise<Workflow[]> {
  await delay(120);

  let result = [...workflowsDb];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.triggerDetail.toLowerCase().includes(q)
    );
  }

  if (filters?.status && filters.status !== "all") {
    result = result.filter((w) => w.status === filters.status);
  }

  if (filters?.trigger && filters.trigger !== "all") {
    result = result.filter((w) => w.trigger === filters.trigger);
  }

  return result;
}

export async function getServerWorkflowById(id: string): Promise<Workflow | null> {
  await delay(80);
  const found = workflowsDb.find((w) => w.id === id);
  return found ? { ...found } : null;
}

export async function createServerWorkflow(input: WorkflowInput): Promise<Workflow> {
  await delay(150);

  const newWorkflow: Workflow = {
    id: `wf-${Date.now().toString().slice(-4)}`,
    name: input.name,
    description: input.description,
    trigger: input.trigger,
    triggerDetail: input.triggerDetail,
    status: input.status,
    runsCount: 0,
    successRate: 100,
    lastRunAt: "Nunca",
    lastRunStatus: "idle",
    steps: [
      {
        id: `step-${Date.now()}-1`,
        name: `${input.trigger.toUpperCase()} Inbound Trigger`,
        type: "trigger",
        configLabel: input.triggerDetail,
      },
      {
        id: `step-${Date.now()}-2`,
        name: "Validation & Guard Step",
        type: "condition",
        configLabel: "Verify conditions && payload schema",
      },
      {
        id: `step-${Date.now()}-3`,
        name: input.actionLabel,
        type: "action",
        actionType: input.actionType,
        configLabel: `Execute: ${input.actionType}`,
      },
    ],
    recentLogs: [],
  };

  workflowsDb.unshift(newWorkflow);

  addServerTelemetry({
    actor: "Gabriel Gonçalves",
    action: "WORKFLOW_CREATED",
    target: newWorkflow.name,
    latencyMs: 19,
    status: "201 Created",
  });

  return newWorkflow;
}

export async function toggleServerWorkflowStatus(id: string): Promise<Workflow> {
  await delay(100);

  const index = workflowsDb.findIndex((w) => w.id === id);
  if (index === -1) {
    throw new Error(`Workflow with ID ${id} not found`);
  }

  const current = workflowsDb[index];
  const newStatus = current.status === "active" ? "paused" : "active";
  workflowsDb[index] = {
    ...current,
    status: newStatus,
  };

  addServerTelemetry({
    actor: "Gabriel Gonçalves",
    action: "WORKFLOW_STATUS_TOGGLED",
    target: `${current.name} → ${newStatus.toUpperCase()}`,
    latencyMs: 14,
    status: "200 OK",
  });

  return workflowsDb[index];
}

export async function deleteServerWorkflow(id: string): Promise<boolean> {
  await delay(100);
  const prevLen = workflowsDb.length;
  workflowsDb = workflowsDb.filter((w) => w.id !== id);
  return workflowsDb.length < prevLen;
}

export async function runServerWorkflow(
  id: string
): Promise<{ workflow: Workflow; generatedLogs: WorkflowRunLog[] }> {
  await delay(200);

  const index = workflowsDb.findIndex((w) => w.id === id);
  if (index === -1) {
    throw new Error(`Workflow with ID ${id} not found`);
  }

  const wf = workflowsDb[index];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const generatedLogs: WorkflowRunLog[] = [
    {
      id: `log-${Date.now()}-1`,
      timestamp: timeStr,
      level: "info",
      message: `[DISPARADOR] Verificando fuente: ${wf.trigger.toUpperCase()} (${wf.triggerDetail}).`,
      stepId: wf.steps[0]?.id,
    },
    {
      id: `log-${Date.now()}-2`,
      timestamp: timeStr,
      level: "info",
      message: `[EVALUACIÓN] Condición de seguridad y datos validada: OK.`,
      stepId: wf.steps[1]?.id,
    },
    {
      id: `log-${Date.now()}-3`,
      timestamp: timeStr,
      level: "info",
      message: `[ACCIÓN] Ejecutando: ${wf.steps[2]?.name || "Acción configurada"}.`,
      stepId: wf.steps[2]?.id,
    },
    {
      id: `log-${Date.now()}-4`,
      timestamp: timeStr,
      level: "success",
      message: `[ÉXITO] Pipeline '${wf.name}' ejecutado con éxito en 310ms. Salida: 200 OK.`,
      stepId: wf.steps[2]?.id,
    },
  ];

  workflowsDb[index] = {
    ...wf,
    runsCount: wf.runsCount + 1,
    lastRunAt: "Justo ahora",
    lastRunStatus: "success",
    recentLogs: generatedLogs,
  };

  addServerTelemetry({
    actor: "Runner / Automated Engine",
    action: "WORKFLOW_EXECUTED",
    target: `${wf.name} (310ms)`,
    latencyMs: 24,
    status: "200 OK",
  });

  return {
    workflow: workflowsDb[index],
    generatedLogs,
  };
}

/**
 * Evaluates active event workflows when a task is completed (status == 'done').
 * Runs the matching pipeline, increments runs count, generates logs, records telemetry,
 * and returns notification payloads to be rendered in the application client.
 */
export async function triggerTaskWorkflows(task: Task): Promise<TriggeredWorkflowResult[]> {
  const triggered: TriggeredWorkflowResult[] = [];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  for (let i = 0; i < workflowsDb.length; i++) {
    const wf = workflowsDb[i];
    // Check if workflow is an active event workflow listening for completed tasks
    if (
      wf.trigger === "event" &&
      wf.status === "active" &&
      (wf.triggerDetail.includes("done") || wf.triggerDetail.includes("task.status"))
    ) {
      const isNotification = wf.steps.some(
        (s) => s.actionType === "in_app_notification" || s.name.toLowerCase().includes("in-app")
      );

      const generatedLogs: WorkflowRunLog[] = [
        {
          id: `log-${Date.now()}-1`,
          timestamp: timeStr,
          level: "info",
          message: `[DISPARADOR] Evento detectado: Tarea '${task.id}: ${task.title.slice(0, 32)}...' marcada como 'Completado'.`,
          stepId: wf.steps[0]?.id,
        },
        {
          id: `log-${Date.now()}-2`,
          timestamp: timeStr,
          level: "info",
          message: `[EVALUACIÓN] Workflow activo. Canal de entrega: ${
            isNotification ? "Notificación In-App Reactiva" : wf.steps[2]?.name || "Acción Automática"
          }.`,
          stepId: wf.steps[1]?.id,
        },
        {
          id: `log-${Date.now()}-3`,
          timestamp: timeStr,
          level: "success",
          message: `[ÉXITO] Pipeline completado en 14ms. Notificación emitida para ${task.assignee?.name || "el equipo"}.`,
          stepId: wf.steps[2]?.id,
        },
      ];

      workflowsDb[i] = {
        ...wf,
        runsCount: wf.runsCount + 1,
        lastRunAt: "Justo ahora",
        lastRunStatus: "success",
        recentLogs: generatedLogs,
      };

      addServerTelemetry({
        actor: "Workflow Engine",
        action: "WORKFLOW_TRIGGERED",
        target: `${wf.name} (${task.id})`,
        latencyMs: 14,
        status: "200 OK",
      });

      triggered.push({
        workflowId: wf.id,
        workflowName: wf.name,
        actionType: wf.steps[2]?.actionType || "in_app_notification",
        title: `⚡ Workflow: ${wf.name}`,
        message: `La tarea "${task.id}: ${task.title}" fue completada. Automatización ejecutada con éxito.`,
        taskId: task.id,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return triggered;
}
