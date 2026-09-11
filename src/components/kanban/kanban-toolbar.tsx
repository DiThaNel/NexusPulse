"use client";

import * as React from "react";
import { useTaskStore } from "@/stores/task-store";
import { useAuthStore } from "@/stores/auth-store";
import { useLanguage } from "@/components/language-provider";
import { DEMO_USERS, type TaskPriority } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  Lock,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export function KanbanToolbar() {
  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    clearFilters,
    openCreateModal,
  } = useTaskStore();

  const { canEdit, user } = useAuthStore();
  const { t } = useLanguage();

  const isEditable = canEdit();
  const hasActiveFilters =
    searchQuery !== "" || priorityFilter !== "all" || assigneeFilter !== "all";

  return (
    <div className="space-y-3">
      {/* Read-only Alert Banner (if Viewer) */}
      {!isEditable && (
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span>{t.kanban.readOnlyBanner}</span>
        </div>
      )}

      {/* Main Toolbar Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left Side: Search + Filter Selects */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.kanban.toolbar.searchPlaceholder}
              className="w-full h-8 pl-8 pr-7 rounded-lg border border-border/50 bg-card/40 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Priority Select */}
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as TaskPriority | "all")
            }
            className="h-8 px-2.5 rounded-lg border border-border/50 bg-card/40 text-xs text-muted-foreground hover:text-foreground outline-none cursor-pointer"
          >
            <option value="all">{t.kanban.toolbar.allPriorities}</option>
            <option value="urgent">{t.kanban.priorities.urgent}</option>
            <option value="high">{t.kanban.priorities.high}</option>
            <option value="medium">{t.kanban.priorities.medium}</option>
            <option value="low">{t.kanban.priorities.low}</option>
          </select>

          {/* Assignee Select */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-border/50 bg-card/40 text-xs text-muted-foreground hover:text-foreground outline-none cursor-pointer"
          >
            <option value="all">{t.kanban.toolbar.allAssignees}</option>
            {DEMO_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t.kanban.toolbar.clearFilters}</span>
            </Button>
          )}
        </div>

        {/* Right Side: New Task Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="inverted"
            size="sm"
            onClick={() => openCreateModal("todo")}
            disabled={!isEditable}
            className="h-8 gap-1.5 text-xs"
            title={!isEditable ? t.kanban.card.readOnlyTooltip : undefined}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.kanban.toolbar.newTask}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
