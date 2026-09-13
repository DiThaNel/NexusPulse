import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Workflow, WorkflowRunLog } from "@/types";
import { WorkflowInput } from "@/lib/validations/workflow";
import { useNotificationStore } from "@/stores/notification-store";

export const WORKFLOWS_QUERY_KEY = ["workflows"];

interface WorkflowsFilters {
  search?: string;
  status?: string;
  trigger?: string;
}

export function useWorkflowsQuery(filters?: WorkflowsFilters) {
  return useQuery<Workflow[]>({
    queryKey: [...WORKFLOWS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.set("search", filters.search);
      if (filters?.status && filters.status !== "all") params.set("status", filters.status);
      if (filters?.trigger && filters.trigger !== "all") params.set("trigger", filters.trigger);

      const url = `/api/workflows${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Error al obtener los workflows del servidor");
      }
      return res.json();
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useToggleWorkflowStatusMutation() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/workflows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleStatus: true }),
      });
      if (!res.ok) {
        throw new Error("Fallo al actualizar el estado del workflow");
      }
      return res.json() as Promise<Workflow>;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: WORKFLOWS_QUERY_KEY });

      const previousWorkflows = queryClient.getQueryData<Workflow[]>(WORKFLOWS_QUERY_KEY);

      if (previousWorkflows) {
        queryClient.setQueriesData<Workflow[]>(
          { queryKey: WORKFLOWS_QUERY_KEY },
          (old) =>
            old?.map((wf) =>
              wf.id === id
                ? {
                    ...wf,
                    status: wf.status === "active" ? "paused" : "active",
                  }
                : wf
            )
        );
      }

      return { previousWorkflows };
    },
    onError: (_err, _id, context) => {
      if (context?.previousWorkflows) {
        queryClient.setQueryData(WORKFLOWS_QUERY_KEY, context.previousWorkflows);
      }
      showNotification(
        "rollback",
        "Rollback Automático Activado",
        "El servidor rechazó el cambio de estado. Se restauró el estado previo."
      );
    },
    onSuccess: (data) => {
      showNotification(
        "success",
        "Estado Actualizado",
        `Workflow '${data.name}' ahora está ${data.status === "active" ? "Activo" : "Pausado"}.`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY });
    },
  });
}

export function useRunWorkflowMutation() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/workflows/${id}/run`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Error en la ejecución del workflow");
      }
      return res.json() as Promise<{
        success: boolean;
        workflow: Workflow;
        logs: WorkflowRunLog[];
        message: string;
      }>;
    },
    onSuccess: (data) => {
      showNotification(
        "success",
        "Ejecución Completada",
        `Workflow '${data.workflow.name}' ejecutado con éxito (200 OK).`
      );
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY });
    },
    onError: () => {
      showNotification(
        "warning",
        "Fallo en la Ejecución",
        "Ocurrió un error al despachar la simulación del workflow."
      );
    },
  });
}

export function useCreateWorkflowMutation() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (input: WorkflowInput) => {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al crear el workflow");
      }
      return res.json() as Promise<Workflow>;
    },
    onSuccess: (created) => {
      showNotification(
        "success",
        "Workflow Creado",
        `Automatización '${created.name}' añadida con éxito.`
      );
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY });
    },
    onError: (err) => {
      showNotification(
        "warning",
        "Error de Validación",
        err instanceof Error ? err.message : "No se pudo crear el workflow."
      );
    },
  });
}
