import { NextRequest, NextResponse } from "next/server";
import { taskSchema } from "@/lib/validations/task";
import {
  getServerTasks,
  createServerTask,
  simulateNetworkLatency,
} from "@/lib/server-tasks";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;
  const priority = searchParams.get("priority") || undefined;
  const assignee = searchParams.get("assignee") || undefined;

  // Realistic latency for TanStack Query demo
  await simulateNetworkLatency(120);

  const tasks = getServerTasks({ search, priority, assignee });

  return NextResponse.json({
    tasks,
    total: tasks.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const shouldSimulateError =
      request.nextUrl.searchParams.get("simulateError") === "true" ||
      request.headers.get("x-simulate-error") === "true";

    await simulateNetworkLatency(200);

    if (shouldSimulateError) {
      return NextResponse.json(
        {
          error: "Simulated Server Failure: Failed to persist task.",
          type: "SIMULATED_OPTIMISTIC_ROLLBACK",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const result = taskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.issues,
        },
        { status: 400 }
      );
    }

    const newTask = createServerTask(result.data);

    return NextResponse.json(
      {
        success: true,
        task: newTask,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
