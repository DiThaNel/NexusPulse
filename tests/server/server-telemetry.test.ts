import { describe, it, expect, beforeEach } from "vitest";
import {
  getServerTelemetry,
  addServerTelemetry,
  clearServerTelemetry,
} from "@/lib/server-telemetry";

describe("Server Telemetry Ring Buffer", () => {
  beforeEach(() => {
    clearServerTelemetry();
  });

  it("should initialize empty after clearing", () => {
    expect(getServerTelemetry()).toHaveLength(0);
  });

  it("should add telemetry entries and record fields", () => {
    addServerTelemetry({
      actor: "Gabriel Gonçalves",
      action: "TASK_CREATED",
      target: "NP-108",
      latencyMs: 18,
      status: "201 Created",
    });

    const logs = getServerTelemetry();
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe("TASK_CREATED");
    expect(logs[0].target).toBe("NP-108");
    expect(logs[0].latencyMs).toBe(18);
  });

  it("should enforce a maximum capacity of 25 in the ring buffer", () => {
    for (let i = 0; i < 30; i++) {
      addServerTelemetry({
        actor: "System Tester",
        action: "TASK_STATUS_CHANGED",
        target: `NP-${i}`,
        latencyMs: 10 + i,
        status: "200 OK",
      });
    }

    const logs = getServerTelemetry();
    expect(logs).toHaveLength(25);
    // The most recent item should be at index 0 (unshift)
    expect(logs[0].target).toBe("NP-29");
  });
});
