import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "@/stores/task-store";

describe("Task Store (Zustand)", () => {
  beforeEach(() => {
    // Reset filters and modal state
    useTaskStore.setState({
      searchQuery: "",
      priorityFilter: "all",
      assigneeFilter: "all",
      isTaskModalOpen: false,
      editingTask: null,
    });
  });

  it("should initialize with pre-seeded tasks", () => {
    const tasks = useTaskStore.getState().tasks;
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0].id).toBe("NP-101");
  });

  it("should add a new task", () => {
    const initialCount = useTaskStore.getState().tasks.length;
    useTaskStore.getState().addTask({
      title: "Nueva Tarea de Vitest",
      description: "Probando store de Zustand",
      status: "todo",
      priority: "urgent",
      assigneeId: "usr-1",
      estimateHours: 5,
      tags: ["testing", "vitest"],
    });

    const tasks = useTaskStore.getState().tasks;
    expect(tasks.length).toBe(initialCount + 1);

    const added = tasks.find((t) => t.title === "Nueva Tarea de Vitest");
    expect(added).toBeDefined();
    expect(added?.priority).toBe("urgent");
    expect(added?.status).toBe("todo");
  });

  it("should update an existing task", () => {
    const tasks = useTaskStore.getState().tasks;
    const targetId = tasks[0].id;

    useTaskStore.getState().updateTask(targetId, {
      title: "Título Actualizado por Test",
      priority: "low",
    });

    const updated = useTaskStore.getState().tasks.find((t) => t.id === targetId);
    expect(updated?.title).toBe("Título Actualizado por Test");
    expect(updated?.priority).toBe("low");
  });

  it("should move a task to a different status column", () => {
    const tasks = useTaskStore.getState().tasks;
    const targetId = tasks[0].id;

    useTaskStore.getState().moveTask(targetId, "done");

    const moved = useTaskStore.getState().tasks.find((t) => t.id === targetId);
    expect(moved?.status).toBe("done");
  });

  it("should delete a task", () => {
    const tasks = useTaskStore.getState().tasks;
    const targetId = tasks[0].id;
    const initialCount = tasks.length;

    useTaskStore.getState().deleteTask(targetId);

    const afterDelete = useTaskStore.getState().tasks;
    expect(afterDelete.length).toBe(initialCount - 1);
    expect(afterDelete.find((t) => t.id === targetId)).toBeUndefined();
  });

  it("should handle filter updates and filter clearing", () => {
    useTaskStore.getState().setSearchQuery("Zod");
    useTaskStore.getState().setPriorityFilter("urgent");
    useTaskStore.getState().setAssigneeFilter("usr-1");

    expect(useTaskStore.getState().searchQuery).toBe("Zod");
    expect(useTaskStore.getState().priorityFilter).toBe("urgent");
    expect(useTaskStore.getState().assigneeFilter).toBe("usr-1");

    useTaskStore.getState().clearFilters();

    expect(useTaskStore.getState().searchQuery).toBe("");
    expect(useTaskStore.getState().priorityFilter).toBe("all");
    expect(useTaskStore.getState().assigneeFilter).toBe("all");
  });
});
