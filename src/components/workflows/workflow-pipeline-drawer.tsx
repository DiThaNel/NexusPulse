"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Workflow, WorkflowRunLog } from "@/types";
import { useLanguage } from "@/components/language-provider";
import { useAuthStore } from "@/stores/auth-store";
import { useRunWorkflowMutation } from "@/hooks/use-workflows-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
  GitFork,
  ArrowRight,
  Terminal,
  Zap,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowPipelineDrawerProps {
  workflow: Workflow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowPipelineDrawer({
  workflow,
  isOpen,
  onClose,
}: WorkflowPipelineDrawerProps) {
  const { t } = useLanguage();
  const { canEdit } = useAuthStore();
  const isEditable = canEdit();

  const { mutateAsync: runWorkflow, isPending: isMutationPending } =
    useRunWorkflowMutation();

  const [activeStepIndex, setActiveStepIndex] = React.useState<number | null>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [logs, setLogs] = React.useState<WorkflowRunLog[]>([]);

  // Sync logs when opening
  React.useEffect(() => {
    if (workflow) {
      setLogs(workflow.recentLogs || []);
      setActiveStepIndex(null);
      setIsSimulating(false);
    }
  }, [workflow, isOpen]);

  // Escape key handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!workflow) return null;

  // Simulate step-by-step pipeline execution
  const handleExecuteLive = async () => {
    if (!isEditable || isSimulating) return;

    setIsSimulating(true);
    setActiveStepIndex(0);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Step 1: Trigger
    setLogs([
      {
        id: `live-${Date.now()}-1`,
        timestamp: timeStr,
        level: "info",
        message: `[DISPARADOR] Verificando fuente: ${workflow.trigger.toUpperCase()} (${workflow.triggerDetail}).`,
      },
    ]);

    await new Promise((r) => setTimeout(r, 450));

    // Step 2: Condition
    setActiveStepIndex(1);
    setLogs((prev) => [
      ...prev,
      {
        id: `live-${Date.now()}-2`,
        timestamp: timeStr,
        level: "info",
        message: `[EVALUACIÓN] Criterios de regla y esquema de datos validados correctamente: OK.`,
      },
    ]);

    await new Promise((r) => setTimeout(r, 450));

    // Step 3: Action & Server persist
    setActiveStepIndex(2);
    setLogs((prev) => [
      ...prev,
      {
        id: `live-${Date.now()}-3`,
        timestamp: timeStr,
        level: "info",
        message: `[ACCIÓN] Despachando llamada a: ${workflow.steps[2]?.name || "Acción configurada"}.`,
      },
    ]);

    try {
      const response = await runWorkflow(workflow.id);
      setActiveStepIndex(3); // All complete

      setLogs((prev) => [
        ...prev,
        {
          id: `live-${Date.now()}-4`,
          timestamp: timeStr,
          level: "success",
          message: `[ÉXITO] Pipeline '${workflow.name}' ejecutado con éxito en 320ms. Salida: 200 OK.`,
        },
      ]);
    } catch {
      setActiveStepIndex(null);
      setLogs((prev) => [
        ...prev,
        {
          id: `live-${Date.now()}-err`,
          timestamp: timeStr,
          level: "error",
          message: `[ERROR] Falló la persistencia de ejecución en el servidor.`,
        },
      ]);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="pipeline-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="pipeline-drawer-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 350,
              mass: 0.8,
            }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/40 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground">
                    {workflow.name}
                  </h2>
                  <Badge
                    variant={workflow.status === "active" ? "success" : "warning"}
                    className="text-[10px] py-0 px-2"
                  >
                    {workflow.status === "active"
                      ? t.workflows.filters.active
                      : t.workflows.filters.paused}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.workflows.pipeline.drawerSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="inverted"
                  size="sm"
                  disabled={!isEditable || isSimulating || isMutationPending}
                  onClick={handleExecuteLive}
                  title={
                    !isEditable
                      ? t.workflows.card.readOnlyTooltip
                      : t.workflows.pipeline.runExecutionBtn
                  }
                  className="h-8 text-xs gap-1.5"
                >
                  {!isEditable ? (
                    <Lock className="h-3 w-3 text-amber-500" />
                  ) : (
                    <Play
                      className={cn(
                        "h-3 w-3 text-emerald-400",
                        isSimulating && "animate-spin"
                      )}
                    />
                  )}
                  <span>
                    {isSimulating
                      ? t.workflows.pipeline.statusRunning
                      : t.workflows.pipeline.runExecutionBtn}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6 overflow-y-auto">
              {/* Visual Pipeline Graph */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Pipeline Stages (Trigger ➔ Rule ➔ Action)
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Runs: {workflow.runsCount} • Success: {workflow.successRate}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                  {/* Step 1: Trigger Node */}
                  <div
                    className={cn(
                      "rounded-xl border p-4 transition-all duration-300 relative",
                      activeStepIndex === 0
                        ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]"
                        : activeStepIndex !== null && activeStepIndex > 0
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-border/50 bg-card/60"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Radio className="h-4 w-4 text-blue-500" />
                        <span>{t.workflows.pipeline.triggerNode}</span>
                      </div>
                      {activeStepIndex !== null && activeStepIndex > 0 && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-in zoom-in-75 duration-200" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-foreground mb-1">
                      {workflow.steps[0]?.name || "Inbound Event"}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground bg-muted/40 rounded px-2 py-1 border border-border/30 truncate">
                      {workflow.steps[0]?.configLabel || workflow.triggerDetail}
                    </div>
                  </div>

                  {/* Step 2: Condition Node */}
                  <div
                    className={cn(
                      "rounded-xl border p-4 transition-all duration-300 relative",
                      activeStepIndex === 1
                        ? "border-purple-500 bg-purple-500/10 ring-1 ring-purple-500 shadow-lg shadow-purple-500/10 scale-[1.02]"
                        : activeStepIndex !== null && activeStepIndex > 1
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-border/50 bg-card/60"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <span>{t.workflows.pipeline.conditionNode}</span>
                      </div>
                      {activeStepIndex !== null && activeStepIndex > 1 && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-in zoom-in-75 duration-200" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-foreground mb-1">
                      {workflow.steps[1]?.name || "Rule Evaluation"}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground bg-muted/40 rounded px-2 py-1 border border-border/30 truncate">
                      {workflow.steps[1]?.configLabel || "Criterios de seguridad OK"}
                    </div>
                  </div>

                  {/* Step 3: Action Node */}
                  <div
                    className={cn(
                      "rounded-xl border p-4 transition-all duration-300 relative",
                      activeStepIndex === 2
                        ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                        : activeStepIndex === 3
                        ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/40"
                        : "border-border/50 bg-card/60"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <GitFork className="h-4 w-4 text-emerald-500" />
                        <span>{t.workflows.pipeline.actionNode}</span>
                      </div>
                      {activeStepIndex === 3 && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-in zoom-in-75 duration-200" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-foreground mb-1">
                      {workflow.steps[2]?.name || "Acción Despachada"}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground bg-muted/40 rounded px-2 py-1 border border-border/30 truncate">
                      {workflow.steps[2]?.configLabel || "Despacho exitoso"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Console & Logs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                    <Terminal className="h-3.5 w-3.5 text-primary" />
                    <span>{t.workflows.pipeline.consoleTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    nexus-telemetry@prod:~$
                  </span>
                </div>

                <div className="rounded-xl border border-border/60 bg-neutral-950 p-4 font-mono text-xs text-neutral-200 space-y-2 min-h-[140px] max-h-[220px] overflow-y-auto select-text shadow-inner">
                  {logs.length === 0 ? (
                    <div className="text-neutral-500 py-6 text-center text-xs">
                      {t.workflows.pipeline.noLogs}
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-2.5 animate-in fade-in-0 duration-150"
                      >
                        <span className="text-neutral-500 shrink-0 text-[11px]">
                          [{log.timestamp}]
                        </span>
                        <span
                          className={cn(
                            "font-bold text-[10px] uppercase px-1 rounded shrink-0",
                            log.level === "success" && "bg-emerald-500/20 text-emerald-400",
                            log.level === "info" && "bg-blue-500/20 text-blue-400",
                            log.level === "warn" && "bg-amber-500/20 text-amber-400",
                            log.level === "error" && "bg-red-500/20 text-red-400"
                          )}
                        >
                          {log.level}
                        </span>
                        <span className="text-neutral-300 leading-relaxed text-[11px]">
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-4 border-t border-border/40 bg-muted/10">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-8 text-xs"
              >
                {t.workflows.pipeline.close}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
