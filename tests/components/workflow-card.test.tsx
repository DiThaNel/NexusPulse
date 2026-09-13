import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { Workflow } from "@/types";
import { useAuthStore } from "@/stores/auth-store";
import { DEMO_USERS } from "@/types";

describe("WorkflowCard Component", () => {
  const sampleWorkflow: Workflow = {
    id: "wf-1",
    name: "GitHub Sync & Deploy Trigger",
    description:
      "Sincroniza commits de la rama main, ejecuta verificación de tests y dispara el despliegue automático a producción.",
    trigger: "webhook",
    triggerDetail: "push:refs/heads/main",
    status: "active",
    runsCount: 1420,
    successRate: 99.9,
    lastRunAt: "Hace 4 minutos",
    steps: [],
  };

  it("should render workflow name, trigger detail, and success rate", () => {
    useAuthStore.setState({ user: DEMO_USERS[0] });
    const onOpen = vi.fn();

    renderWithProviders(
      <WorkflowCard workflow={sampleWorkflow} onOpenPipeline={onOpen} />,
      { locale: "en" }
    );

    expect(
      screen.getByText("GitHub Sync & Deploy Trigger")
    ).toBeInTheDocument();
    expect(screen.getByText("push:refs/heads/main")).toBeInTheDocument();
    expect(screen.getByText("99.9%")).toBeInTheDocument();
    expect(screen.getByText("1,420")).toBeInTheDocument();
  });

  it("should invoke onOpenPipeline when clicking View Pipeline button", async () => {
    useAuthStore.setState({ user: DEMO_USERS[0] });
    const onOpen = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <WorkflowCard workflow={sampleWorkflow} onOpenPipeline={onOpen} />,
      { locale: "en" }
    );

    const viewPipelineBtn = screen.getByRole("button", {
      name: /View Pipeline|Ver Pipeline/i,
    });
    await user.click(viewPipelineBtn);

    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: "wf-1" }));
  });
});
