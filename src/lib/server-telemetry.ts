import { TelemetryLog } from "@/types";

const globalForTelemetry = globalThis as unknown as {
  serverTelemetry: TelemetryLog[] | undefined;
};

const INITIAL_TELEMETRY: TelemetryLog[] = [
  {
    id: "telem-init-1",
    timestamp: "15:28:44",
    actor: "Gabriel Gonçalves",
    action: "TASK_STATUS_CHANGED",
    target: "NP-104 (in_progress → in_review)",
    latencyMs: 14,
    status: "200 OK",
  },
  {
    id: "telem-init-2",
    timestamp: "15:28:30",
    actor: "GitHub CI Webhook",
    action: "WORKFLOW_TRIGGERED",
    target: "Deploy to Production #28",
    latencyMs: 22,
    status: "200 OK",
  },
  {
    id: "telem-init-3",
    timestamp: "15:28:12",
    actor: "Elena Rostova",
    action: "TASK_STATUS_CHANGED",
    target: "NP-103 (todo → in_progress)",
    latencyMs: 18,
    status: "200 OK",
  },
  {
    id: "telem-init-4",
    timestamp: "15:28:01",
    actor: "System Sentinel",
    action: "HEALTH_CHECK_PING",
    target: "GET /api/analytics",
    latencyMs: 8,
    status: "200 OK",
  },
  {
    id: "telem-init-5",
    timestamp: "15:27:58",
    actor: "TanStack Query Cache",
    action: "BACKGROUND_REVALIDATE",
    target: "GET /api/workflows",
    latencyMs: 12,
    status: "304 Cached",
  },
];

export const serverTelemetry: TelemetryLog[] =
  globalForTelemetry.serverTelemetry ?? [...INITIAL_TELEMETRY];

if (process.env.NODE_ENV !== "production") {
  globalForTelemetry.serverTelemetry = serverTelemetry;
}

export function getServerTelemetry(): TelemetryLog[] {
  return [...serverTelemetry];
}

export function addServerTelemetry(entry: Omit<TelemetryLog, "id" | "timestamp">) {
  const now = new Date();
  const timeStr = now.toTimeString().split(" ")[0]; // "HH:MM:SS"
  const newLog: TelemetryLog = {
    id: `telem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: timeStr,
    ...entry,
  };
  serverTelemetry.unshift(newLog);
  if (serverTelemetry.length > 25) {
    serverTelemetry.pop();
  }
  return newLog;
}
