import { z } from "zod";

export const workflowSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(60, "El nombre no puede exceder 60 caracteres")
    .trim(),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(160, "La descripción no puede exceder 160 caracteres")
    .trim(),
  trigger: z.enum(["webhook", "cron", "event", "manual"]),
  triggerDetail: z
    .string()
    .min(2, "El detalle del disparador es requerido")
    .max(80, "El detalle no puede exceder 80 caracteres")
    .trim(),
  actionType: z.enum([
    "slack_notify",
    "github_deploy",
    "database_archive",
    "task_auto_assign",
    "in_app_notification",
  ]),
  actionLabel: z
    .string()
    .min(3, "La descripción de la acción es requerida")
    .max(80, "La acción no puede exceder 80 caracteres")
    .trim(),
  status: z.enum(["active", "paused", "draft"]).default("active"),
});

export type WorkflowInput = z.infer<typeof workflowSchema>;
