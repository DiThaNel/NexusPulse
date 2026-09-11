"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task, type TaskPriority } from "@/types";
import { useAuthStore } from "@/stores/auth-store";
import { useTaskStore } from "@/stores/task-store";
import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, GripVertical, Lock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  task: Task;
  isOverlay?: boolean;
}

export function KanbanCard({ task, isOverlay = false }: KanbanCardProps) {
  const { canEdit } = useAuthStore();
  const { deleteTask, openEditModal } = useTaskStore();
  const { t } = useLanguage();
  const [showActions, setShowActions] = React.useState(false);

  const isEditable = canEdit();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: !isEditable || isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return {
          variant: "destructive" as const,
          label: t.kanban.priorities.urgent,
        };
      case "high":
        return {
          variant: "warning" as const,
          label: t.kanban.priorities.high,
        };
      case "medium":
        return {
          variant: "default" as const,
          label: t.kanban.priorities.medium,
        };
      case "low":
        return {
          variant: "outline" as const,
          label: t.kanban.priorities.low,
        };
    }
  };

  const priorityInfo = getPriorityBadge(task.priority);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border border-border/50 bg-card p-3.5 shadow-sm transition-all duration-150 select-none",
        isDragging && "opacity-30 border-dashed border-primary",
        isOverlay && "rotate-2 shadow-xl border-primary ring-1 ring-primary/40 cursor-grabbing",
        !isDragging && !isOverlay && "hover:border-border hover:shadow-md",
        !isEditable && "cursor-default"
      )}
    >
      {/* Top row: ID, Priority, Drag Handle / Lock */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground font-semibold">
            {task.id}
          </span>
          <Badge
            variant={priorityInfo.variant}
            className="text-[9px] py-0 px-1.5 font-medium uppercase tracking-wider"
          >
            {priorityInfo.label}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {/* Read only indicator if viewer */}
          {!isEditable && (
            <div
              title={t.kanban.card.readOnlyTooltip}
              className="text-amber-500/80 p-0.5"
            >
              <Lock className="h-3 w-3" />
            </div>
          )}

          {/* Drag handle */}
          {isEditable && !isOverlay && (
            <div
              {...attributes}
              {...listeners}
              className="opacity-0 group-hover:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground rounded hover:bg-muted/60 transition-opacity"
              title="Arrastrar para mover"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4
        onClick={() => isEditable && openEditModal(task)}
        className={cn(
          "text-xs font-semibold text-foreground leading-snug tracking-tight mb-2.5",
          isEditable && "hover:text-primary cursor-pointer transition-colors"
        )}
      >
        {task.title}
      </h4>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-muted/50 border border-border/40 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Footer: Estimate & Assignee Avatar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1 font-mono text-[10px]">
          {task.estimateHours !== undefined && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-60" />
              {task.estimateHours}
              {t.kanban.card.estimate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Edit/Delete on hover (if editable) */}
          {isEditable && !isOverlay && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(task);
                }}
                className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title={t.kanban.card.editTask}
              >
                <Pencil className="h-2.5 w-2.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
                className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title={t.kanban.card.deleteTask}
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            </div>
          )}

          {/* Assignee Avatar */}
          {task.assignee && (
            <div
              className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold ring-1 ring-border/60"
              title={`${task.assignee.name} (${task.assignee.title})`}
            >
              {task.assignee.initials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
