import { TelemetryLog } from "@/types";

const globalForTelemetry = globalThis as unknown as {
  serverTelemetry: TelemetryLog[] | undefined;
};

// Start with a clean empty telemetry list
const INITIAL_TELEMETRY: TelemetryLog[] = [];

export const serverTelemetry: TelemetryLog[] =
  globalForTelemetry.serverTelemetry ?? [...INITIAL_TELEMETRY];

// Clear immediately if already in global
serverTelemetry.length = 0;

if (process.env.NODE_ENV !== "production") {
  globalForTelemetry.serverTelemetry = serverTelemetry;
}

export function getServerTelemetry(): TelemetryLog[] {
  return [...serverTelemetry];
}

export function clearServerTelemetry(): void {
  serverTelemetry.length = 0;
  if (globalForTelemetry.serverTelemetry) {
    globalForTelemetry.serverTelemetry.length = 0;
  }
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
