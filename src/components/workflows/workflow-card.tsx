"use client";

import * as React from "react";
import { Workflow } from "@/types";
import { useLanguage } from "@/components/language-provider";
import { useAuthStore } from "@/stores/auth-store";
import {
  useToggleWorkflowStatusMutation,
  useRunWorkflowMutation,
} from "@/hooks/use-workflows-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  GitFork,
  Radio,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { localizeWorkflow, localizeTimeAgo } from "@/lib/translations/card-translations";

interface WorkflowCardProps {
  workflow: Workflow;
  onOpenPipeline: (workflow: Workflow) => void;
}

export function WorkflowCard({ workflow: rawWorkflow, onOpenPipeline }: WorkflowCardProps) {
  const { t, locale } = useLanguage();
  const { canEdit } = useAuthStore();
  const isEditable = canEdit();

  const workflow = React.useMemo(() => localizeWorkflow(rawWorkflow, locale), [rawWorkflow, locale]);

  const { mutate: toggleStatus, isPending: isToggling } =
    useToggleWorkflowStatusMutation();
  const { mutate: runWorkflow, isPending: isRunning } = useRunWorkflowMutation();

  const isActive = workflow.status === "active";

  const getTriggerIcon = () => {
    switch (workflow.trigger) {
      case "webhook":
        return <Radio className="h-3.5 w-3.5 text-blue-500" />;
      case "cron":
        return <Clock className="h-3.5 w-3.5 text-purple-500" />;
      case "event":
        return <GitFork className="h-3.5 w-3.5 text-emerald-500" />;
      case "manual":
      default:
        return <Play className="h-3.5 w-3.5 text-amber-500" />;
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border/50 bg-card/40 p-4 transition-all duration-200 hover:border-border/80 hover:bg-card/70 hover:shadow-md",
        !isActive && "opacity-75"
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left info: Status, Name, Description, Trigger */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 border border-border/40 text-[10px] font-mono text-muted-foreground">
              {getTriggerIcon()}
              <span className="uppercase tracking-wider font-semibold">
                {workflow.trigger}
              </span>
            </div>

            <Badge
              variant={isActive ? "success" : "warning"}
              className="text-[10px] py-0 px-2 font-medium"
            >
              {isActive ? t.workflows.filters.active : t.workflows.filters.paused}
            </Badge>

            <span className="text-[11px] font-mono text-muted-foreground/70">
              {workflow.triggerDetail}
            </span>
          </div>

          <div>
            <h3
              onClick={() => onOpenPipeline(workflow)}
              className="text-sm sm:text-base font-semibold text-foreground hover:text-primary cursor-pointer transition-colors leading-tight"
            >
              {workflow.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {workflow.description}
            </p>
          </div>
        </div>

        {/* Right side: Stats & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t border-border/30 lg:border-t-0">
          {/* Metrics */}
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <div className="text-left sm:text-right">
              <div className="font-mono font-semibold text-foreground text-sm">
                {workflow.successRate}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {t.workflows.card.successRate}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="font-mono font-semibold text-foreground text-sm">
                {workflow.runsCount.toLocaleString()}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {t.workflows.card.runs}
              </div>
            </div>

            <div className="text-left sm:text-right hidden sm:block">
              <div className="font-mono text-[11px] text-foreground">
                {localizeTimeAgo(workflow.lastRunAt, locale)}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {t.workflows.card.lastRun}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Run Live button */}
            <Button
              variant="outline"
              size="sm"
              disabled={!isEditable || isRunning}
              onClick={() => runWorkflow(workflow.id)}
              title={
                !isEditable
                  ? t.workflows.card.readOnlyTooltip
                  : t.workflows.card.runNow
              }
              className="h-8 gap-1.5 text-xs border-border/60 hover:border-primary/50 text-foreground"
            >
              {!isEditable ? (
                <Lock className="h-3 w-3 text-amber-500" />
              ) : (
                <Play
                  className={cn(
                    "h-3 w-3 text-emerald-500",
                    isRunning && "animate-spin"
                  )}
                />
              )}
              <span className="hidden sm:inline">
                {isRunning ? t.workflows.card.running : t.workflows.card.runNow}
              </span>
            </Button>

            {/* View Pipeline / Drawer */}
            <Button
              variant="inverted"
              size="sm"
              onClick={() => onOpenPipeline(workflow)}
              className="h-8 gap-1 text-xs"
            >
              <span>{t.workflows.card.viewPipeline}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            {/* Quick status toggle button */}
            {isEditable && (
              <Button
                variant="ghost"
                size="icon"
                disabled={isToggling}
                onClick={() => toggleStatus(workflow.id)}
                title={isActive ? t.workflows.card.pause : t.workflows.card.activate}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                {isActive ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-emerald-500" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
