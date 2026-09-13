import * as React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { LiveTelemetryFeed } from "@/components/analytics/live-telemetry-feed";
import { TelemetryLog } from "@/types";

describe("LiveTelemetryFeed Component", () => {
  const sampleLogs: TelemetryLog[] = [
    {
      id: "log-1",
      timestamp: "12:04:15",
      actor: "Gabriel Gonçalves",
      action: "TASK_STATUS_CHANGED",
      target: "NP-101",
      latencyMs: 14,
      status: "200 OK",
    },
    {
      id: "log-2",
      timestamp: "12:04:20",
      actor: "Elena Rostova",
      action: "WORKFLOW_EXECUTED",
      target: "wf-1",
      latencyMs: 38,
      status: "201 Created",
    },
  ];

  it("should render live telemetry logs with actions, actors, and latency", () => {
    renderWithProviders(<LiveTelemetryFeed logs={sampleLogs} />, { locale: "es" });

    expect(screen.getByText("TASK_STATUS_CHANGED")).toBeInTheDocument();
    expect(screen.getByText("Gabriel Gonçalves")).toBeInTheDocument();
    expect(screen.getByText("NP-101")).toBeInTheDocument();
    expect(screen.getByText("14ms")).toBeInTheDocument();
    expect(screen.getByText("200 OK")).toBeInTheDocument();

    expect(screen.getByText("WORKFLOW_EXECUTED")).toBeInTheDocument();
    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();
    expect(screen.getByText("38ms")).toBeInTheDocument();
    expect(screen.getByText("201 Created")).toBeInTheDocument();
  });

  it("should render clean terminal empty state when logs are empty", () => {
    renderWithProviders(<LiveTelemetryFeed logs={[]} />, { locale: "es" });

    expect(
      screen.getByText(/Stream de telemetría limpio|Clean telemetry stream/i)
    ).toBeInTheDocument();
  });
});
