"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { type Task, type TaskStatus } from "@/types";
import { useTaskStore } from "@/stores/task-store";
import { useAuthStore } from "@/stores/auth-store";
import { useLanguage } from "@/components/language-provider";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { KanbanCard } from "@/components/kanban/kanban-card";
import { KanbanToolbar } from "@/components/kanban/kanban-toolbar";
import { TaskModal } from "@/components/kanban/task-modal";

const COLUMNS: { id: TaskStatus; titleKey: "backlog" | "todo" | "in_progress" | "in_review" | "done" }[] = [
  { id: "backlog", titleKey: "backlog" },
  { id: "todo", titleKey: "todo" },
  { id: "in_progress", titleKey: "in_progress" },
  { id: "in_review", titleKey: "in_review" },
  { id: "done", titleKey: "done" },
];

export function KanbanBoard() {
  const {
    tasks,
    searchQuery,
    priorityFilter,
    assigneeFilter,
    moveTask,
    reorderTask,
    initializeFromStorage,
  } = useTaskStore();

  const { canEdit } = useAuthStore();
  const { t } = useLanguage();

  const [mounted, setMounted] = React.useState(false);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  // Synchronize localStorage safely after initial mount to prevent SSR hydration mismatch
  React.useEffect(() => {
    initializeFromStorage();
    setMounted(true);
  }, [initializeFromStorage]);

  // Configure sensors for drag & drop with activation constraint (prevents click interception)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks based on search and selected filters
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesTags = task.tags?.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      // Priority filter
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }

      // Assignee filter
      if (assigneeFilter !== "all" && task.assignee?.id !== assigneeFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, priorityFilter, assigneeFilter]);

  // Group tasks by column status
  const tasksByColumn = React.useMemo(() => {
    const acc: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };

    filteredTasks.forEach((task) => {
      if (acc[task.status]) {
        acc[task.status].push(task);
      } else {
        acc.backlog.push(task);
      }
    });

    return acc;
  }, [filteredTasks]);

  const isEditable = canEdit();

  // Handlers for DnD
  const handleDragStart = (event: DragStartEvent) => {
    if (!isEditable) return;
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!isEditable) return;
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Check if dragging over a column directly
    const isOverColumn = COLUMNS.some((c) => c.id === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      if (activeTaskItem.status !== newStatus) {
        moveTask(activeId, newStatus);
      }
      return;
    }

    // Dragging over another task
    const overTaskItem = tasks.find((t) => t.id === overId);
    if (overTaskItem && activeTaskItem.status !== overTaskItem.status) {
      moveTask(activeId, overTaskItem.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    if (!isEditable) return;

    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId !== overId) {
      reorderTask(activeId, overId);
    }
  };

  // Render static skeleton matching board layout during SSR to guarantee 100% clean hydration
  if (!mounted) {
    return (
      <div className="space-y-6">
        <KanbanToolbar />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start pb-6">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className="flex flex-col rounded-xl border border-border/40 bg-card/30 p-3 min-h-[420px]"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/30">
                <div className="h-3.5 w-20 rounded bg-muted/60 animate-pulse" />
                <div className="h-3.5 w-5 rounded bg-muted/40 animate-pulse" />
              </div>
              <div className="space-y-2.5 pt-1">
                <div className="h-20 rounded-xl border border-border/30 bg-card/40 animate-pulse" />
                <div className="h-24 rounded-xl border border-border/30 bg-card/40 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kanban Toolbar */}
      <KanbanToolbar />

      {/* Drag & Drop Context with deterministic ID */}
      <DndContext
        id="nexus-pulse-kanban-dnd"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start overflow-x-auto pb-6">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={t.kanban.columns[col.titleKey]}
              tasks={tasksByColumn[col.id]}
            />
          ))}
        </div>

        {/* Drag Overlay with floating preview */}
        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task Create / Edit Modal */}
      <TaskModal />
    </div>
  );
}
