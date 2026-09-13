import * as React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { ThroughputChart } from "@/components/analytics/throughput-chart";
import { ThroughputDataPoint } from "@/types";

describe("ThroughputChart Component", () => {
  const sampleTimeline: ThroughputDataPoint[] = [
    { date: "Lun", label: "07 Sep", completed: 0, created: 2 },
    { date: "Mar", label: "08 Sep", completed: 1, created: 3 },
    { date: "Dom", label: "Hoy (13 Sep)", completed: 3, created: 4 },
  ];

  it("should render chart header and dates in Spanish when locale is 'es'", () => {
    renderWithProviders(<ThroughputChart data={sampleTimeline} />, { locale: "es" });

    expect(screen.getByText("Lun")).toBeInTheDocument();
    expect(screen.getByText("Mar")).toBeInTheDocument();
    expect(screen.getByText("Dom")).toBeInTheDocument();
  });

  it("should render dates translated to English when locale is 'en'", () => {
    renderWithProviders(<ThroughputChart data={sampleTimeline} />, { locale: "en" });

    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();
  });
});
