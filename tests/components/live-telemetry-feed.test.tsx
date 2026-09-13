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

  it("should render live telemetry logs with localized actions, actors, and latency in Spanish", () => {
    renderWithProviders(<LiveTelemetryFeed logs={sampleLogs} />, { locale: "es" });

    expect(screen.getByText("CAMBIO DE ESTADO")).toBeInTheDocument();
    expect(screen.getByText("Gabriel Gonçalves")).toBeInTheDocument();
    expect(screen.getByText("NP-101")).toBeInTheDocument();
    expect(screen.getByText(/14\s*ms/)).toBeInTheDocument();
    expect(screen.getByText("200 OK")).toBeInTheDocument();

    expect(screen.getByText("WORKFLOW EJECUTADO")).toBeInTheDocument();
    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();
    expect(screen.getByText(/38\s*ms/)).toBeInTheDocument();
    expect(screen.getByText("201 Created")).toBeInTheDocument();
    expect(screen.getByText("transmisión en vivo")).toBeInTheDocument();
  });

  it("should localize actions and badge into English when locale is en", () => {
    renderWithProviders(<LiveTelemetryFeed logs={sampleLogs} />, { locale: "en" });

    expect(screen.getByText("TASK STATUS CHANGED")).toBeInTheDocument();
    expect(screen.getByText("WORKFLOW EXECUTED")).toBeInTheDocument();
    expect(screen.getByText("live stream")).toBeInTheDocument();
  });

  it("should render clean terminal empty state when logs are empty", () => {
    renderWithProviders(<LiveTelemetryFeed logs={[]} />, { locale: "es" });

    expect(
      screen.getByText(/Stream de telemetría limpio|Clean telemetry stream/i)
    ).toBeInTheDocument();
  });
});
