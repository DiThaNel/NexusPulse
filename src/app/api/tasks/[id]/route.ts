import { NextRequest, NextResponse } from "next/server";
import {
  updateServerTask,
  moveServerTask,
  deleteServerTask,
  simulateNetworkLatency,
} from "@/lib/server-tasks";
import { triggerTaskWorkflows } from "@/lib/server-workflows";
import { type TaskStatus, type TriggeredWorkflowResult } from "@/types";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const shouldSimulateError =
      searchParams.get("simulateError") === "true" ||
      request.headers.get("x-simulate-error") === "true";

    // Simulate realistic network transmission delay
    await simulateNetworkLatency(180);

    // If error simulation is toggled on, reject to demonstrate optimistic rollback
    if (shouldSimulateError) {
      return NextResponse.json(
        {
          error: "Simulated Network Error: Failed to update task on server.",
          type: "SIMULATED_OPTIMISTIC_ROLLBACK",
          taskId: id,
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    // If updating status (drag & drop move)
    if (body.status && typeof body.status === "string") {
      const moved = moveServerTask(
        id,
        body.status as TaskStatus,
        body.targetIndex
      );
      if (!moved) {
        return NextResponse.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }

      // If task was moved to "done", trigger reactive event workflows
      let triggeredWorkflows: TriggeredWorkflowResult[] = [];
      if (body.status === "done") {
        triggeredWorkflows = await triggerTaskWorkflows(moved);
      }

      return NextResponse.json({
        success: true,
        task: moved,
        triggeredWorkflows,
      });
    }

    // General updates
    const updated = updateServerTask(id, body);
    if (!updated) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    let triggeredWorkflows: TriggeredWorkflowResult[] = [];
    if (body.status === "done") {
      triggeredWorkflows = await triggerTaskWorkflows(updated);
    }

    return NextResponse.json({
      success: true,
      task: updated,
      triggeredWorkflows,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const shouldSimulateError =
      searchParams.get("simulateError") === "true" ||
      request.headers.get("x-simulate-error") === "true";

    await simulateNetworkLatency(180);

    if (shouldSimulateError) {
      return NextResponse.json(
        {
          error: "Simulated Server Error: Could not delete task.",
          type: "SIMULATED_OPTIMISTIC_ROLLBACK",
          taskId: id,
        },
        { status: 500 }
      );
    }

    const deleted = deleteServerTask(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
