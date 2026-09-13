import { describe, it, expect } from "vitest";
import { taskSchema } from "@/lib/validations/task";

describe("Task Schema Validation (Zod & Security)", () => {
  it("should validate a well-formed task payload", () => {
    const validTask = {
      title: "Implementar mutaciones optimistas",
      description: "Garantizar respuesta instantánea en UI",
      status: "in_progress",
      priority: "high",
      assigneeId: "usr-1",
      estimateHours: 8,
      tags: ["frontend", "react-query"],
    };

    const result = taskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Implementar mutaciones optimistas");
      expect(result.data.status).toBe("in_progress");
      expect(result.data.priority).toBe("high");
      expect(result.data.estimateHours).toBe(8);
      expect(result.data.tags).toHaveLength(2);
    }
  });

  it("should reject a task with a title shorter than 3 characters", () => {
    const invalidTask = {
      title: "AB",
      status: "todo",
      priority: "medium",
      assigneeId: "usr-1",
    };

    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("al menos 3 caracteres");
    }
  });

  it("should reject a task with a title exceeding 100 characters", () => {
    const longTitle = "A".repeat(101);
    const invalidTask = {
      title: longTitle,
      status: "todo",
      priority: "medium",
      assigneeId: "usr-1",
    };

    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("no puede superar los 100 caracteres");
    }
  });

  it("should reject an invalid status or priority enum value", () => {
    const invalidStatus = {
      title: "Valid Title Here",
      status: "unknown_status",
      priority: "medium",
      assigneeId: "usr-1",
    };

    const resultStatus = taskSchema.safeParse(invalidStatus);
    expect(resultStatus.success).toBe(false);

    const invalidPriority = {
      title: "Valid Title Here",
      status: "todo",
      priority: "critical_unknown",
      assigneeId: "usr-1",
    };

    const resultPriority = taskSchema.safeParse(invalidPriority);
    expect(resultPriority.success).toBe(false);
  });

  it("should enforce assigneeId presence", () => {
    const missingAssignee = {
      title: "Valid Title Here",
      status: "todo",
      priority: "medium",
      assigneeId: "",
    };

    const result = taskSchema.safeParse(missingAssignee);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Debes asignar un responsable");
    }
  });

  it("should default tags to an empty array when not provided", () => {
    const taskWithoutTags = {
      title: "Task without tags",
      status: "backlog",
      priority: "low",
      assigneeId: "usr-2",
    };

    const result = taskSchema.safeParse(taskWithoutTags);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });
});
