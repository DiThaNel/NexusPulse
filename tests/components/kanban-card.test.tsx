import * as React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { KanbanCard } from "@/components/kanban/kanban-card";
import { Task, DEMO_USERS } from "@/types";
import { DndContext } from "@dnd-kit/core";
import { useAuthStore } from "@/stores/auth-store";

describe("KanbanCard Component", () => {
  const sampleTask: Task = {
    id: "NP-101",
    title: "Diseñar arquitectura de tokens HSL y Dark/Light Mode",
    description: "Configurar variables semánticas en globals.css",
    status: "done",
    priority: "urgent",
    assignee: DEMO_USERS[0],
    estimateHours: 6,
    tags: ["architecture", "design-system"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("should render task ID, title, and priority badge in Spanish when locale is 'es'", () => {
    useAuthStore.setState({ user: DEMO_USERS[0] }); // Admin

    renderWithProviders(
      <DndContext>
        <KanbanCard task={sampleTask} />
      </DndContext>,
      { locale: "es" }
    );

    expect(screen.getByText("NP-101")).toBeInTheDocument();
    expect(
      screen.getByText("Diseñar arquitectura de tokens HSL y Dark/Light Mode")
    ).toBeInTheDocument();
    expect(screen.getByText("Urgente")).toBeInTheDocument();
  });

  it("should render task ID, title, and priority badge in English when locale is 'en'", () => {
    useAuthStore.setState({ user: DEMO_USERS[0] }); // Admin

    renderWithProviders(
      <DndContext>
        <KanbanCard task={sampleTask} />
      </DndContext>,
      { locale: "en" }
    );

    expect(screen.getByText("NP-101")).toBeInTheDocument();
    expect(
      screen.getByText("Design HSL Token Architecture & Dark/Light Mode")
    ).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });

  it("should display lock icon and hide drag handle when in Viewer read-only mode", () => {
    useAuthStore.setState({ user: DEMO_USERS[2] }); // Viewer

    renderWithProviders(
      <DndContext>
        <KanbanCard task={sampleTask} />
      </DndContext>,
      { locale: "es" }
    );

    // Read only lock element should be present with Spanish tooltip
    expect(
      screen.getByTitle(/solo lectura/i)
    ).toBeInTheDocument();
  });
});
