import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiMetricCard } from "@/components/analytics/kpi-metric-card";

describe("KpiMetricCard Component", () => {
  it("should render label, value, and detail", () => {
    render(
      <KpiMetricCard
        label="Throughput de Tareas"
        value={18}
        change={12.5}
        detail="Completadas vs ciclo anterior"
      />
    );

    expect(screen.getByText("Throughput de Tareas")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("Completadas vs ciclo anterior")).toBeInTheDocument();
    expect(screen.getByText("+12.5%")).toBeInTheDocument();
  });

  it("should format negative change and highlight inverse metrics properly", () => {
    render(
      <KpiMetricCard
        label="Tiempo de Ciclo"
        value="4.2h"
        change={-8}
        detail="De Todo a Done"
        isInverseGood={true}
      />
    );

    expect(screen.getByText("Tiempo de Ciclo")).toBeInTheDocument();
    expect(screen.getByText("4.2h")).toBeInTheDocument();
    const changeBadge = screen.getByText("-8%");
    expect(changeBadge).toBeInTheDocument();
    // For isInverseGood, a decrease (-8%) is good (emerald)
    expect(changeBadge.parentElement).toHaveClass("text-emerald-500");
  });
});
