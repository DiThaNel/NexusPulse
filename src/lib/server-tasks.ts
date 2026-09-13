import { type Task, type TaskPriority, type TaskStatus, DEMO_USERS } from "@/types";
import { type TaskInput } from "@/lib/validations/task";
import { addServerTelemetry } from "./server-telemetry";

const INITIAL_SERVER_TASKS: Task[] = [
  {
    id: "NP-101",
    title: "Diseñar arquitectura de tokens HSL y Dark/Light Mode",
    description: "Configurar variables semánticas en globals.css y ThemeProvider sin flash de hidratación.",
    status: "done",
    priority: "urgent",
    assignee: DEMO_USERS[0], // Gabriel
    tags: ["architecture", "design-system"],
    estimateHours: 6,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "NP-102",
    title: "Construir Shell de la aplicación y Command Palette (⌘K)",
    description: "Implementar sidebar colapsable, breadcrumbs dinámicos y modal de búsqueda con cmdk.",
    status: "done",
    priority: "high",
    assignee: DEMO_USERS[0], // Gabriel
    tags: ["shell", "cmdk", "navigation"],
    estimateHours: 8,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "NP-103",
    title: "Implementar sistema de Drag & Drop con @dnd-kit",
    description: "Orquestar columnas reordenables, sensores accesibles y animaciones fluidas.",
    status: "in_progress",
    priority: "high",
    assignee: DEMO_USERS[1], // Elena
    tags: ["kanban", "dnd-kit", "frontend"],
    estimateHours: 12,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "NP-104",
    title: "Integrar validaciones de seguridad y sanitización con Zod",
    description: "Prevenir inyecciones maliciosas y validar esquemas de datos en tiempo de ejecución.",
    status: "in_review",
    priority: "urgent",
    assignee: DEMO_USERS[0], // Gabriel
    tags: ["security", "zod", "typesafe"],
    estimateHours: 4,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "NP-105",
    title: "Conectar mutaciones optimistas con TanStack Query",
    description: "Garantizar respuesta instantánea en la UI con rollback automático si falla el servidor.",
    status: "todo",
    priority: "medium",
    assignee: DEMO_USERS[1], // Elena
    tags: ["react-query", "async", "cache"],
    estimateHours: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "NP-106",
    title: "Diseñar telemetría y gráficos interactivos de rendimiento",
    description: "Crear componentes de métricas visuales con Recharts / Tremor para la Fase 5.",
    status: "todo",
    priority: "low",
    assignee: DEMO_USERS[2], // Lucas
    tags: ["analytics", "charts"],
    estimateHours: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "NP-107",
    title: "Automatizar suite de pruebas unitarias con Jest y RTL",
    description: "Alcanzar cobertura de código sobre custom hooks, stores de Zustand y componentes atómicos.",
    status: "backlog",
    priority: "medium",
    assignee: DEMO_USERS[0], // Gabriel
    tags: ["testing", "jest", "ci-cd"],
    estimateHours: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Global in-memory storage for server state across requests in Node process
// using globalThis to survive Next.js module hot reloading in development
const globalForTasks = globalThis as unknown as {
  serverTasks: Task[] | undefined;
};

export const serverTasks: Task[] =
  globalForTasks.serverTasks ?? [...INITIAL_SERVER_TASKS];

if (process.env.NODE_ENV !== "production") {
  globalForTasks.serverTasks = serverTasks;
}

/**
 * Simulates a realistic server network latency (100-200ms)
 * to make optimistic UI visually evident to the user.
 */
export async function simulateNetworkLatency(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getServerTasks(filters?: {
  search?: string;
  priority?: string;
  assignee?: string;
}): Task[] {
  let result = [...serverTasks];

  if (!filters) return result;

  if (filters.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filters.priority && filters.priority !== "all") {
    result = result.filter((t) => t.priority === filters.priority);
  }

  if (filters.assignee && filters.assignee !== "all") {
    result = result.filter((t) => t.assignee?.id === filters.assignee);
  }

  return result;
}

export function createServerTask(input: TaskInput): Task {
  const assigneeUser =
    DEMO_USERS.find((u) => u.id === input.assigneeId) || DEMO_USERS[0];

  const newTask: Task = {
    id: `NP-${Math.floor(100 + Math.random() * 900)}`,
    title: input.title,
    description: input.description || "",
    status: input.status,
    priority: input.priority,
    assignee: assigneeUser,
    tags: input.tags || [],
    estimateHours: input.estimateHours,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  serverTasks.unshift(newTask);

  addServerTelemetry({
    actor: newTask.assignee?.name || "Gabriel Gonçalves",
    action: "TASK_CREATED",
    target: `${newTask.id}: ${newTask.title.slice(0, 24)}...`,
    latencyMs: Math.floor(Math.random() * 12) + 10,
    status: "201 Created",
  });

  return newTask;
}

export function updateServerTask(
  id: string,
  updates: Partial<Task>
): Task | null {
  const index = serverTasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const current = serverTasks[index];
  const updated: Task = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  serverTasks[index] = updated;
  return updated;
}

export function moveServerTask(
  id: string,
  newStatus: TaskStatus,
  targetIndex?: number
): Task | null {
  const index = serverTasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const [task] = serverTasks.splice(index, 1);
  const oldStatus = task.status;
  task.status = newStatus;
  task.updatedAt = new Date().toISOString();

  if (targetIndex !== undefined && targetIndex >= 0) {
    serverTasks.splice(targetIndex, 0, task);
  } else {
    serverTasks.push(task);
  }

  addServerTelemetry({
    actor: task.assignee?.name || "Gabriel Gonçalves",
    action: "TASK_STATUS_CHANGED",
    target: `${task.id} (${oldStatus} → ${newStatus})`,
    latencyMs: Math.floor(Math.random() * 14) + 8,
    status: "200 OK",
  });

  return task;
}

export function deleteServerTask(id: string): boolean {
  const index = serverTasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  const [removed] = serverTasks.splice(index, 1);

  addServerTelemetry({
    actor: "Gabriel Gonçalves",
    action: "TASK_DELETED",
    target: `${removed.id}: ${removed.title.slice(0, 20)}...`,
    latencyMs: Math.floor(Math.random() * 8) + 6,
    status: "200 OK",
  });

  return true;
}

export function resetServerTasks(): Task[] {
  serverTasks.length = 0;
  serverTasks.push(...INITIAL_SERVER_TASKS);
  return [...serverTasks];
}
