import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres." })
    .max(100, { message: "El título no puede superar los 100 caracteres." })
    .trim(),
  description: z.string().max(500).optional(),
  status: z.enum(["backlog", "todo", "in_progress", "in_review", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assigneeId: z.string().min(1, { message: "Debes asignar un responsable." }),
  estimateHours: z.coerce.number().min(0).max(100).optional(),
  tags: z.array(z.string().trim()).default([]),
});

export type TaskInput = z.infer<typeof taskSchema>;
