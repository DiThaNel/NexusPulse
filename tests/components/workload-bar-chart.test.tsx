import * as React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { WorkloadBarChart } from "@/components/analytics/workload-bar-chart";
import { AssigneeWorkloadData } from "@/types";

describe("WorkloadBarChart Component", () => {
  const sampleWorkload: AssigneeWorkloadData[] = [
    {
      userId: "usr-1",
      userName: "Gabriel Gonçalves",
      initials: "GG",
      completed: 2,
      inProgress: 1,
      backlog: 1,
      total: 4,
    },
    {
      userId: "usr-2",
      userName: "Elena Rostova",
      initials: "ER",
      completed: 1,
      inProgress: 1,
      backlog: 0,
      total: 2,
    },
  ];

  it("should render members names, initials, and counts", () => {
    renderWithProviders(<WorkloadBarChart data={sampleWorkload} />, { locale: "es" });

    expect(screen.getByText("Gabriel Gonçalves")).toBeInTheDocument();
    expect(screen.getByText("GG")).toBeInTheDocument();
    expect(screen.getByText("4 total")).toBeInTheDocument();

    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();
    expect(screen.getByText("ER")).toBeInTheDocument();
    expect(screen.getByText("2 total")).toBeInTheDocument();
  });
});
