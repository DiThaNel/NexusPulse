"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type Task, type TaskStatus } from "@/types";
import { useAuthStore } from "@/stores/auth-store";
import { useTaskStore } from "@/stores/task-store";
import { KanbanCard } from "@/components/kanban/kanban-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/components/language-provider";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { canEdit } = useAuthStore();
  const { openCreateModal } = useTaskStore();
  const { t } = useLanguage();

  const isEditable = canEdit();

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "Column",
      status: id,
    },
  });

  const taskIds = React.useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-xl border border-border/50 bg-card/25 p-3 min-h-[480px] transition-colors duration-150",
        isOver && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground tracking-tight">
            {title}
          </span>
          <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center text-[10px] font-mono font-medium">
            {tasks.length}
          </span>
        </div>

        {isEditable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openCreateModal(id)}
            className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted/70"
            title={`${t.kanban.addTaskTo} ${title}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Column Content (Droppable Sortable Area) */}
      <div className="flex-1 flex flex-col gap-2.5">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Empty state placeholder when column has no tasks */}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-border/40 p-6 text-center">
            <span className="text-[11px] text-muted-foreground font-mono">
              {t.kanban.emptyColumn}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
