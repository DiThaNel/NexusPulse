import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnalyticsPayload, AnalyticsTimeRange } from "@/types";

export const ANALYTICS_QUERY_KEY = ["analytics"];

export function useAnalyticsQuery(range: AnalyticsTimeRange = "30d") {
  return useQuery<AnalyticsPayload>({
    queryKey: [...ANALYTICS_QUERY_KEY, range],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?range=${range}`);
      if (!res.ok) {
        throw new Error("Error al obtener la telemetría de analítica");
      }
      return res.json() as Promise<AnalyticsPayload>;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useClearTelemetryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/analytics", { method: "DELETE" });
      if (!res.ok) throw new Error("Error al limpiar eventos");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
    },
  });
}

