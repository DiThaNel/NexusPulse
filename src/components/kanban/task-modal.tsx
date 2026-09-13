"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/stores/task-store";
import { useLanguage } from "@/components/language-provider";
import { taskSchema, type TaskInput } from "@/lib/validations/task";
import { DEMO_USERS, type TaskPriority, type TaskStatus } from "@/types";
import { useCreateTaskMutation, TASKS_QUERY_KEY } from "@/hooks/use-tasks-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "@/stores/notification-store";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

import { localizeTask } from "@/lib/translations/card-translations";

export function TaskModal() {
  const {
    isTaskModalOpen,
    editingTask,
    defaultStatusForNew,
    closeTaskModal,
    updateTask,
  } = useTaskStore();

  const { showNotification } = useNotificationStore();
  const queryClient = useQueryClient();
  const { mutate: createTaskOptimistic } = useCreateTaskMutation();
  const { t, locale } = useLanguage();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState<TaskStatus>("todo");
  const [priority, setPriority] = React.useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = React.useState(DEMO_USERS[0].id);
  const [estimateHours, setEstimateHours] = React.useState<string>("4");
  const [tagsInput, setTagsInput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Preserve editing headers during exit animation
  const isEditingRef = React.useRef(false);
  const activeTaskIdRef = React.useRef<string | null>(null);

  // Sync state when modal opens for create or edit
  React.useEffect(() => {
    if (isTaskModalOpen) {
      if (editingTask) {
        const localized = localizeTask(editingTask, locale);
        isEditingRef.current = true;
        activeTaskIdRef.current = localized.id;
        setTitle(localized.title);
        setDescription(localized.description || "");
        setStatus(localized.status);
        setPriority(localized.priority);
        setAssigneeId(localized.assignee?.id || DEMO_USERS[0].id);
        setEstimateHours(localized.estimateHours ? String(localized.estimateHours) : "");
        setTagsInput(localized.tags ? localized.tags.join(", ") : "");
      } else {
        isEditingRef.current = false;
        activeTaskIdRef.current = null;
        setTitle("");
        setDescription("");
        setStatus(defaultStatusForNew);
        setPriority("medium");
        setAssigneeId(DEMO_USERS[0].id);
        setEstimateHours("4");
        setTagsInput("");
      }
      setError(null);
    }
  }, [editingTask, defaultStatusForNew, isTaskModalOpen]);

  // Keyboard shortcut: close with Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTaskModalOpen) {
        closeTaskModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTaskModalOpen, closeTaskModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    const rawInput = {
      title,
      description,
      status,
      priority,
      assigneeId,
      estimateHours: estimateHours ? Number(estimateHours) : undefined,
      tags: parsedTags,
    };

    // Zod Schema Validation (Security & Sanitization)
    const result = taskSchema.safeParse(rawInput);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Datos inválidos";
      setError(firstError);
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, result.data);
      fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.triggeredWorkflows && Array.isArray(data.triggeredWorkflows)) {
            data.triggeredWorkflows.forEach((tw: any) => {
              showNotification("workflow", tw.title, tw.message);
            });
            queryClient.invalidateQueries({ queryKey: ["workflows"] });
          }
          queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
          queryClient.invalidateQueries({ queryKey: ["analytics"] });
        })
        .catch(() => {
          queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
        });
    } else {
      createTaskOptimistic(result.data);
    }

    closeTaskModal();
  };

  return (
    <AnimatePresence>
      {isTaskModalOpen && (
        <motion.div
          key="task-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={closeTaskModal}
        >
          <motion.div
            key="task-modal-card"
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
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {isEditingRef.current ? t.kanban.modal.editTitle : t.kanban.modal.createTitle}
                </h3>
                {isEditingRef.current && activeTaskIdRef.current && (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {activeTaskIdRef.current}
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeTaskModal}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

        {/* Error Alert if Validation Fails */}
        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-medium text-foreground">
              {t.kanban.modal.titleLabel} *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.kanban.modal.titlePlaceholder}
              className="w-full h-8 px-3 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-medium text-muted-foreground">
              {t.kanban.modal.descLabel}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.kanban.modal.descPlaceholder}
              className="w-full p-2.5 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Grid: Status, Priority, Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">
                {t.kanban.modal.statusLabel}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full h-8 px-2 rounded-lg border border-border/60 bg-background text-foreground outline-none cursor-pointer"
              >
                <option value="backlog">{t.kanban.columns.backlog}</option>
                <option value="todo">{t.kanban.columns.todo}</option>
                <option value="in_progress">{t.kanban.columns.in_progress}</option>
                <option value="in_review">{t.kanban.columns.in_review}</option>
                <option value="done">{t.kanban.columns.done}</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">
                {t.kanban.modal.priorityLabel}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-8 px-2 rounded-lg border border-border/60 bg-background text-foreground outline-none cursor-pointer"
              >
                <option value="urgent">{t.kanban.priorities.urgent}</option>
                <option value="high">{t.kanban.priorities.high}</option>
                <option value="medium">{t.kanban.priorities.medium}</option>
                <option value="low">{t.kanban.priorities.low}</option>
              </select>
            </div>

            {/* Assignee */}
            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">
                {t.kanban.modal.assigneeLabel}
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full h-8 px-2 rounded-lg border border-border/60 bg-background text-foreground outline-none cursor-pointer"
              >
                {DEMO_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid: Estimate & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">
                {t.kanban.modal.estimateLabel}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={estimateHours}
                onChange={(e) => setEstimateHours(e.target.value)}
                className="w-full h-8 px-3 rounded-lg border border-border/60 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-muted-foreground">
                {t.kanban.modal.tagsLabel}
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder={t.kanban.modal.tagsPlaceholder}
                className="w-full h-8 px-3 rounded-lg border border-border/60 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={closeTaskModal}
              className="h-8 text-xs"
            >
              {t.kanban.modal.cancelBtn}
            </Button>
            <Button type="submit" variant="inverted" size="sm" className="h-8 text-xs">
              {t.kanban.modal.saveBtn}
            </Button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
