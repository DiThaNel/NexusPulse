"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/language-provider";
import { workflowSchema, WorkflowInput } from "@/lib/validations/workflow";
import { useCreateWorkflowMutation } from "@/hooks/use-workflows-query";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowModal({ isOpen, onClose }: WorkflowModalProps) {
  const { t } = useLanguage();
  const { mutate: createWorkflow, isPending } = useCreateWorkflowMutation();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [trigger, setTrigger] = React.useState<"webhook" | "cron" | "event" | "manual">("webhook");
  const [triggerDetail, setTriggerDetail] = React.useState("");
  const [actionType, setActionType] = React.useState<
    "slack_notify" | "github_deploy" | "database_archive" | "task_auto_assign" | "in_app_notification"
  >("github_deploy");
  const [actionLabel, setActionLabel] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Reset state on open
  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setTrigger("webhook");
      setTriggerDetail("push:refs/heads/main");
      setActionType("github_deploy");
      setActionLabel("Disparar despliegue automático a producción");
      setError(null);
    }
  }, [isOpen]);

  // Keyboard shortcut: close with Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const rawInput: WorkflowInput = {
      name,
      description,
      trigger,
      triggerDetail,
      actionType,
      actionLabel,
      status: "active",
    };

    const validation = workflowSchema.safeParse(rawInput);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Datos inválidos";
      setError(firstError);
      return;
    }

    createWorkflow(validation.data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="workflow-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="workflow-modal-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 350,
              mass: 0.8,
            }}
            className="w-full max-w-lg rounded-2xl border border-border/60 bg-card text-card-foreground shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {t.workflows.modal.createTitle}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Define triggers, condiciones y acciones automatizadas.
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  {t.workflows.modal.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.workflows.modal.namePlaceholder}
                  className="w-full h-8 px-3 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  {t.workflows.modal.descLabel} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.workflows.modal.descPlaceholder}
                  className="w-full p-2.5 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Trigger type & Trigger Detail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    {t.workflows.modal.triggerLabel}
                  </label>
                  <select
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-border/60 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="webhook">Webhook (HTTP Inbound)</option>
                    <option value="cron">Cron (Programado)</option>
                    <option value="event">Evento Kanban</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    {t.workflows.modal.triggerDetailLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={triggerDetail}
                    onChange={(e) => setTriggerDetail(e.target.value)}
                    placeholder={t.workflows.modal.triggerDetailPlaceholder}
                    className="w-full h-8 px-3 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Action type & Action description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    {t.workflows.modal.actionTypeLabel}
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-border/60 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="in_app_notification">Notificación en la App (In-App)</option>
                    <option value="github_deploy">Despliegue / CI-CD</option>
                    <option value="slack_notify">Alerta Slack / Ops</option>
                    <option value="database_archive">Archivar Telemetría</option>
                    <option value="task_auto_assign">Auto-Asignar Tarea</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    {t.workflows.modal.actionLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={actionLabel}
                    onChange={(e) => setActionLabel(e.target.value)}
                    placeholder={t.workflows.modal.actionPlaceholder}
                    className="w-full h-8 px-3 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="h-8 text-xs"
                >
                  {t.workflows.modal.cancelBtn}
                </Button>
                <Button
                  type="submit"
                  variant="inverted"
                  size="sm"
                  disabled={isPending}
                  className="h-8 text-xs"
                >
                  {isPending ? "Guardando..." : t.workflows.modal.saveBtn}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
