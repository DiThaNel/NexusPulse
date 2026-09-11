import { create } from "zustand";
import { type Task, type TaskPriority, type TaskStatus, DEMO_USERS } from "@/types";
import { type TaskInput } from "@/lib/validations/task";

const INITIAL_TASKS: Task[] = [
  {
    id: "NP-101",
    title: "Diseñar arquitectura de tokens HSL y Dark/Light Mode",
    description: "Configurar variables semánticas en globals.css y ThemeProvider sin flash de hidratación.",
    status: "done",
    priority: "urgent",
    assignee: DEMO_USERS[0], // Gabriel
    tags: ["architecture", "design-system"],
    estimateHours: 6,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
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
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
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
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
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

const STORAGE_KEY = "nexus-pulse-kanban-tasks";

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  priorityFilter: TaskPriority | "all";
  assigneeFilter: string | "all";
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  defaultStatusForNew: TaskStatus;

  // Actions
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: Partial<TaskInput>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, targetIndex?: number) => void;
  reorderTask: (activeId: string, overId: string) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: TaskPriority | "all") => void;
  setAssigneeFilter: (assigneeId: string | "all") => void;
  clearFilters: () => void;

  // Modal actions
  openCreateModal: (status?: TaskStatus) => void;
  openEditModal: (task: Task) => void;
  closeTaskModal: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => {
  // Load tasks from localStorage if available
  let initialTasks: Task[] = INITIAL_TASKS;
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialTasks = parsed;
        }
      }
    } catch {}
  }

  const saveToStorage = (updatedTasks: Task[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      } catch {}
    }
  };

  return {
    tasks: initialTasks,
    searchQuery: "",
    priorityFilter: "all",
    assigneeFilter: "all",
    isTaskModalOpen: false,
    editingTask: null,
    defaultStatusForNew: "todo",

    addTask: (input) => {
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

      set((state) => {
        const updated = [newTask, ...state.tasks];
        saveToStorage(updated);
        return { tasks: updated, isTaskModalOpen: false, editingTask: null };
      });
    },

    updateTask: (id, updates) => {
      set((state) => {
        const updated = state.tasks.map((task) => {
          if (task.id !== id) return task;

          const updatedAssignee = updates.assigneeId
            ? DEMO_USERS.find((u) => u.id === updates.assigneeId) || task.assignee
            : task.assignee;

          return {
            ...task,
            title: updates.title !== undefined ? updates.title : task.title,
            description: updates.description !== undefined ? updates.description : task.description,
            status: updates.status || task.status,
            priority: updates.priority || task.priority,
            assignee: updatedAssignee,
            estimateHours: updates.estimateHours !== undefined ? updates.estimateHours : task.estimateHours,
            tags: updates.tags || task.tags,
            updatedAt: new Date().toISOString(),
          };
        });

        saveToStorage(updated);
        return { tasks: updated, isTaskModalOpen: false, editingTask: null };
      });
    },

    deleteTask: (id) => {
      set((state) => {
        const updated = state.tasks.filter((t) => t.id !== id);
        saveToStorage(updated);
        return { tasks: updated };
      });
    },

    moveTask: (taskId, newStatus, targetIndex) => {
      set((state) => {
        const taskToMove = state.tasks.find((t) => t.id === taskId);
        if (!taskToMove) return state;

        const otherTasks = state.tasks.filter((t) => t.id !== taskId);
        const updatedTask = {
          ...taskToMove,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        let updated: Task[];
        if (targetIndex !== undefined && targetIndex >= 0) {
          updated = [...otherTasks];
          updated.splice(targetIndex, 0, updatedTask);
        } else {
          updated = [...otherTasks, updatedTask];
        }

        saveToStorage(updated);
        return { tasks: updated };
      });
    },

    reorderTask: (activeId, overId) => {
      set((state) => {
        const oldIndex = state.tasks.findIndex((t) => t.id === activeId);
        const newIndex = state.tasks.findIndex((t) => t.id === overId);

        if (oldIndex === -1 || newIndex === -1) return state;

        const activeTask = state.tasks[oldIndex];
        const overTask = state.tasks[newIndex];

        // Clone array
        const updated = [...state.tasks];
        // Remove item
        updated.splice(oldIndex, 1);
        // Insert item at new index with updated status if changed
        updated.splice(newIndex, 0, {
          ...activeTask,
          status: overTask.status,
          updatedAt: new Date().toISOString(),
        });

        saveToStorage(updated);
        return { tasks: updated };
      });
    },

    setSearchQuery: (query) => set({ searchQuery: query }),
    setPriorityFilter: (priority) => set({ priorityFilter: priority }),
    setAssigneeFilter: (assigneeId) => set({ assigneeFilter: assigneeId }),
    clearFilters: () =>
      set({ searchQuery: "", priorityFilter: "all", assigneeFilter: "all" }),

    openCreateModal: (status = "todo") =>
      set({ isTaskModalOpen: true, editingTask: null, defaultStatusForNew: status }),
    openEditModal: (task) =>
      set({ isTaskModalOpen: true, editingTask: task }),
    closeTaskModal: () =>
      set({ isTaskModalOpen: false, editingTask: null }),
  };
});
