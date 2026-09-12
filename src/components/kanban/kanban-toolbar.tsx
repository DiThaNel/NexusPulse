"use client";

import * as React from "react";
import { useTaskStore } from "@/stores/task-store";
import { useAuthStore } from "@/stores/auth-store";
import { useLanguage } from "@/components/language-provider";
import { DEMO_USERS, type TaskPriority } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsFetching } from "@tanstack/react-query";
import { useNotificationStore } from "@/stores/notification-store";
import { TASKS_QUERY_KEY } from "@/hooks/use-tasks-query";
import {
  ChevronDown,
  Filter,
  Lock,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
  Zap,
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
  const [mounted, setMounted] = React.useState(false);

  const isFetching = useIsFetching({ queryKey: TASKS_QUERY_KEY }) > 0;
  const { simulateError, toggleSimulateError } = useNotificationStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isEditable = mounted ? canEdit() : true;
  const hasActiveFilters =
    searchQuery !== "" || priorityFilter !== "all" || assigneeFilter !== "all";

  return (
    <div className="space-y-3">
      {/* Read-only Alert Banner (if Viewer) */}
      {mounted && !isEditable && (
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
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.kanban.toolbar.searchPlaceholder}
              className="w-full h-8 pl-8 pr-7 rounded-lg border border-border/60 bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 transition-all"
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
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as TaskPriority | "all")
              }
              className="h-8 pl-3 pr-8 rounded-lg border border-border/60 bg-background hover:bg-muted/40 text-xs text-foreground appearance-none outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer transition-colors"
            >
              <option value="all" className="bg-popover text-popover-foreground">
                {t.kanban.toolbar.allPriorities}
              </option>
              <option value="urgent" className="bg-popover text-popover-foreground">
                {t.kanban.priorities.urgent}
              </option>
              <option value="high" className="bg-popover text-popover-foreground">
                {t.kanban.priorities.high}
              </option>
              <option value="medium" className="bg-popover text-popover-foreground">
                {t.kanban.priorities.medium}
              </option>
              <option value="low" className="bg-popover text-popover-foreground">
                {t.kanban.priorities.low}
              </option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none opacity-60" />
          </div>

          {/* Assignee Select */}
          <div className="relative">
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="h-8 pl-3 pr-8 rounded-lg border border-border/60 bg-background hover:bg-muted/40 text-xs text-foreground appearance-none outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer transition-colors"
            >
              <option value="all" className="bg-popover text-popover-foreground">
                {t.kanban.toolbar.allAssignees}
              </option>
              {DEMO_USERS.map((u) => (
                <option key={u.id} value={u.id} className="bg-popover text-popover-foreground">
                  {u.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none opacity-60" />
          </div>

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

        {/* Right Side: Network Status + Simulate Error Toggle + New Task */}
        <div className="flex items-center gap-2">
          {/* Live Sync Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/40 bg-card/30 text-[11px] text-muted-foreground">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isFetching ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span>{isFetching ? t.kanban.toolbar.syncingStatus : t.kanban.toolbar.syncStatus}</span>
          </div>

          {/* Simulate Network Error Button (Rollback Showcase) */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSimulateError}
            className={`h-8 gap-1.5 text-xs transition-all ${
              simulateError
                ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-medium"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
            title="Simula un fallo en el servidor al mover tarjetas para observar el Rollback Optimista"
          >
            <Zap className={`h-3 w-3 ${simulateError ? "text-amber-500 fill-amber-500" : ""}`} />
            <span className="hidden sm:inline">
              {simulateError
                ? t.kanban.toolbar.simulateErrorActive
                : t.kanban.toolbar.simulateNetworkError}
            </span>
            <span className="sm:hidden">
              {simulateError ? "Error ON" : "Simular"}
            </span>
          </Button>

          {/* New Task Button */}
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
