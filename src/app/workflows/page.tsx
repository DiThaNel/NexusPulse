"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Workflow } from "@/types";
import { useLanguage } from "@/components/language-provider";
import { useAuthStore } from "@/stores/auth-store";
import { useWorkflowsQuery } from "@/hooks/use-workflows-query";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { WorkflowPipelineDrawer } from "@/components/workflows/workflow-pipeline-drawer";
import { WorkflowModal } from "@/components/workflows/workflow-modal";
import { Button } from "@/components/ui/button";
import {
  GitFork,
  Plus,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Lock,
  Inbox,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function WorkflowsPage() {
  const { t } = useLanguage();
  const { canEdit } = useAuthStore();
  const isEditable = canEdit();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [triggerFilter, setTriggerFilter] = React.useState("all");

  const [selectedWorkflow, setSelectedWorkflow] = React.useState<Workflow | null>(null);
  const [isPipelineOpen, setIsPipelineOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const {
    data: workflows = [],
    isLoading,
    isFetching,
    refetch,
  } = useWorkflowsQuery({
    search: search || undefined,
    status: statusFilter,
    trigger: triggerFilter,
  });

  const handleOpenPipeline = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsPipelineOpen(true);
  };

  const handleClosePipeline = () => {
    setIsPipelineOpen(false);
  };

  // Keep selected workflow in sync with latest query cache
  React.useEffect(() => {
    if (selectedWorkflow) {
      const updated = workflows.find((w) => w.id === selectedWorkflow.id);
      if (updated) setSelectedWorkflow(updated);
    }
  }, [workflows, selectedWorkflow]);

  return (
    <div className="space-y-6 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
              <GitFork className="h-5 w-5 text-emerald-500" />
              <span>{t.workflows.title}</span>
            </h1>

            {/* Live Sync Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border/40 bg-card text-[11px] font-mono text-muted-foreground shadow-xs">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isFetching
                    ? "bg-amber-400 animate-pulse"
                    : "bg-emerald-500 animate-pulse"
                )}
              />
              <span>
                {isFetching
                  ? t.kanban.toolbar.syncingStatus
                  : t.kanban.toolbar.syncStatus}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            {t.workflows.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 w-8 p-0 border-border/60"
            title="Refrescar estado del servidor"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5 text-muted-foreground", isFetching && "animate-spin")}
            />
          </Button>

          {/* New Workflow Button (RBAC protected) */}
          <Button
            variant="inverted"
            size="sm"
            disabled={!isEditable}
            onClick={() => setIsCreateModalOpen(true)}
            title={!isEditable ? t.workflows.card.readOnlyTooltip : t.workflows.newWorkflowBtn}
            className="gap-1.5 text-xs h-8"
          >
            {!isEditable ? (
              <Lock className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span>{t.workflows.newWorkflowBtn}</span>
          </Button>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/50 bg-card/30">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.workflows.searchPlaceholder}
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-border/60 bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 pl-3 pr-8 rounded-lg border border-border/70 bg-card text-foreground text-xs font-medium appearance-none outline-none cursor-pointer focus:ring-1 focus:ring-primary shadow-xs transition-colors hover:border-border hover:bg-card/90"
            >
              <option value="all" className="bg-card text-foreground">
                {t.workflows.filters.all}
              </option>
              <option value="active" className="bg-card text-foreground">
                {t.workflows.filters.active}
              </option>
              <option value="paused" className="bg-card text-foreground">
                {t.workflows.filters.paused}
              </option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Trigger Filter */}
          <div className="relative">
            <select
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value)}
              className="h-8 pl-3 pr-8 rounded-lg border border-border/70 bg-card text-foreground text-xs font-medium appearance-none outline-none cursor-pointer focus:ring-1 focus:ring-primary shadow-xs transition-colors hover:border-border hover:bg-card/90"
            >
              <option value="all" className="bg-card text-foreground">
                {t.workflows.triggers.all}
              </option>
              <option value="webhook" className="bg-card text-foreground">
                {t.workflows.triggers.webhook}
              </option>
              <option value="cron" className="bg-card text-foreground">
                {t.workflows.triggers.cron}
              </option>
              <option value="event" className="bg-card text-foreground">
                {t.workflows.triggers.event}
              </option>
              <option value="manual" className="bg-card text-foreground">
                {t.workflows.triggers.manual}
              </option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg className="h-3 w-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl border border-border/40 bg-card/20 animate-pulse"
              />
            ))}
          </div>
        ) : workflows.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/20 p-12 text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-muted/40 text-muted-foreground mx-auto flex items-center justify-center">
              <Inbox className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium text-foreground">
              No se encontraron automatizaciones
            </div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Prueba cambiando los filtros de búsqueda o crea una nueva automatización.
            </p>
          </div>
        ) : (
          workflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              onOpenPipeline={handleOpenPipeline}
            />
          ))
        )}
      </div>

      {/* Pipeline Inspector Drawer */}
      <WorkflowPipelineDrawer
        workflow={selectedWorkflow}
        isOpen={isPipelineOpen}
        onClose={handleClosePipeline}
      />

      {/* Create Workflow Modal */}
      <WorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
