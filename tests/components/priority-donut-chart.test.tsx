import * as React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { PriorityDonutChart } from "@/components/analytics/priority-donut-chart";
import { PriorityBreakdownData } from "@/types";

describe("PriorityDonutChart Component", () => {
  const sampleData: PriorityBreakdownData[] = [
    {
      priority: "urgent",
      label: "Urgente",
      count: 2,
      percentage: 28.6,
      color: "hsl(0 84.2% 60.2%)",
    },
    {
      priority: "high",
      label: "Alta",
      count: 2,
      percentage: 28.6,
      color: "hsl(24.6 95% 53.1%)",
    },
    {
      priority: "medium",
      label: "Media",
      count: 2,
      percentage: 28.6,
      color: "hsl(217.2 91.2% 59.8%)",
    },
    {
      priority: "low",
      label: "Baja",
      count: 1,
      percentage: 14.3,
      color: "hsl(142.1 76.2% 36.3%)",
    },
  ];

  it("should render priority legend and total count in Spanish", () => {
    renderWithProviders(<PriorityDonutChart data={sampleData} />, { locale: "es" });

    expect(screen.getByText("Urgente")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText("Media")).toBeInTheDocument();
    expect(screen.getByText("Baja")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("should render priority legend translated to English when locale is 'en'", () => {
    renderWithProviders(<PriorityDonutChart data={sampleData} />, { locale: "en" });

    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();
  });
});
