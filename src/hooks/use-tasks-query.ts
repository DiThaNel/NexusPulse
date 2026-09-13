import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Task, type TaskStatus, DEMO_USERS } from "@/types";
import { type TaskInput } from "@/lib/validations/task";
import { useNotificationStore } from "@/stores/notification-store";

export const TASKS_QUERY_KEY = ["tasks"] as const;

export interface TaskFilters {
  search?: string;
  priority?: string;
  assignee?: string;
}

/**
 * Fetch tasks from the server API with active filters.
 */
export function useTasksQuery(filters?: TaskFilters) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search && filters.search.trim()) {
        params.set("search", filters.search);
      }
      if (filters?.priority && filters.priority !== "all") {
        params.set("priority", filters.priority);
      }
      if (filters?.assignee && filters.assignee !== "all") {
        params.set("assignee", filters.assignee);
      }

      const queryString = params.toString();
      const url = `/api/tasks${queryString ? `?${queryString}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch tasks from server");
      }
      const data = await res.json();
      return (data.tasks || []) as Task[];
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Optimistic mutation to move a task between Kanban columns.
 * Performs immediate cache update (0ms UI reaction) and rolls back
 * automatically if the server rejects or fails.
 */
export function useMoveTaskMutation(filters?: TaskFilters) {
  const queryClient = useQueryClient();
  const { simulateError, showNotification } = useNotificationStore();
  const queryKey = [...TASKS_QUERY_KEY, filters];

  return useMutation({
    mutationFn: async ({
      taskId,
      newStatus,
      targetIndex,
    }: {
      taskId: string;
      newStatus: TaskStatus;
      targetIndex?: number;
    }) => {
      const url = `/api/tasks/${taskId}${simulateError ? "?simulateError=true" : ""}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(simulateError ? { "x-simulate-error": "true" } : {}),
        },
        body: JSON.stringify({ status: newStatus, targetIndex }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Server rejected task move.");
      }

      return res.json();
    },

    // 1. Optimistic Update before server network response
    onMutate: async ({ taskId, newStatus, targetIndex }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous cache value
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || [];

      // Optimistically update the cache immediately
      queryClient.setQueryData<Task[]>(queryKey, (oldTasks = []) => {
        const taskToMove = oldTasks.find((t) => t.id === taskId);
        if (!taskToMove) return oldTasks;

        const otherTasks = oldTasks.filter((t) => t.id !== taskId);
        const updatedTask: Task = {
          ...taskToMove,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        if (targetIndex !== undefined && targetIndex >= 0) {
          const next = [...otherTasks];
          next.splice(targetIndex, 0, updatedTask);
          return next;
        }

        return [...otherTasks, updatedTask];
      });

      // Return a context object with the snapshotted value
      return { previousTasks, taskId, targetStatus: newStatus };
    },

    // 2. Rollback to snapshot if mutation fails
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(queryKey, context.previousTasks);
      }

      showNotification(
        "rollback",
        "Rollback Automático Activado",
        "El servidor simuló un fallo de red. La tarea regresó instantáneamente a su columna original."
      );
    },

    // 3. Success feedback
    onSuccess: () => {
      showNotification(
        "success",
        "Sincronizado con el Servidor",
        "Cambio persistido en el backend a través de TanStack Query."
      );
    },

    // 4. Invalidate to refetch fresh server state and update analytics
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

/**
 * Optimistic mutation to create a new task.
 */
export function useCreateTaskMutation(filters?: TaskFilters) {
  const queryClient = useQueryClient();
  const { simulateError, showNotification } = useNotificationStore();
  const queryKey = [...TASKS_QUERY_KEY, filters];

  return useMutation({
    mutationFn: async (input: TaskInput) => {
      const url = `/api/tasks${simulateError ? "?simulateError=true" : ""}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(simulateError ? { "x-simulate-error": "true" } : {}),
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create task");
      }

      return res.json();
    },

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || [];

      // Generate temporary optimistic task
      const tempTask: Task = {
        id: `NP-TEMP-${Date.now().toString().slice(-4)}`,
        title: input.title,
        description: input.description || "",
        status: input.status,
        priority: input.priority,
        assignee: DEMO_USERS.find((u) => u.id === input.assigneeId) || DEMO_USERS[0],
        tags: input.tags || [],
        estimateHours: input.estimateHours,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(queryKey, (old = []) => [tempTask, ...old]);

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(queryKey, context.previousTasks);
      }
      showNotification(
        "rollback",
        "Error al Crear Tarea",
        "El servidor rechazó la creación. Se revirtió el estado optimista."
      );
    },

    onSuccess: (data) => {
      showNotification(
        "success",
        "Tarea Creada y Persistida",
        `La tarea ${data.task?.id || ""} fue confirmada por el servidor.`
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

/**
 * Optimistic mutation to delete a task.
 */
export function useDeleteTaskMutation(filters?: TaskFilters) {
  const queryClient = useQueryClient();
  const { simulateError, showNotification } = useNotificationStore();
  const queryKey = [...TASKS_QUERY_KEY, filters];

  return useMutation({
    mutationFn: async (taskId: string) => {
      const url = `/api/tasks/${taskId}${simulateError ? "?simulateError=true" : ""}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          ...(simulateError ? { "x-simulate-error": "true" } : {}),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
      return res.json();
    },

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || [];

      // Optimistically remove from cache
      queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
        old.filter((t) => t.id !== taskId)
      );

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(queryKey, context.previousTasks);
      }
      showNotification(
        "rollback",
        "Error al Eliminar Tarea",
        "No se pudo eliminar en el servidor. La tarea ha sido restaurada."
      );
    },

    onSuccess: () => {
      showNotification(
        "success",
        "Tarea Eliminada",
        "Confirmado por el servidor."
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
