import {
  AnalyticsPayload,
  AnalyticsTimeRange,
  ThroughputDataPoint,
  AssigneeWorkloadData,
  PriorityBreakdownData,
  TelemetryLog,
  DEMO_USERS,
} from "@/types";
import { getServerTasks } from "./server-tasks";
import { getServerWorkflows } from "./server-workflows";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getServerAnalytics(
  range: AnalyticsTimeRange = "30d"
): Promise<AnalyticsPayload> {
  await delay(120);

  const [tasks, workflows] = await Promise.all([
    getServerTasks(),
    getServerWorkflows(),
  ]);

  // Compute live task counts
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const backlogTasks = tasks.filter((t) => t.status === "backlog" || t.status === "todo").length;

  // Workflows stats
  const totalWorkflowRuns = workflows.reduce((acc, w) => acc + w.runsCount, 0);
  const avgWorkflowSuccess =
    workflows.length > 0
      ? Number(
          (
            workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length
          ).toFixed(1)
        )
      : 99.5;

  // Timeline points based on range
  let throughputTimeline: ThroughputDataPoint[] = [];

  if (range === "7d") {
    throughputTimeline = [
      { date: "Lun", label: "07 Sep", completed: 8, created: 6 },
      { date: "Mar", label: "08 Sep", completed: 12, created: 10 },
      { date: "Mié", label: "09 Sep", completed: 15, created: 8 },
      { date: "Jue", label: "10 Sep", completed: 11, created: 14 },
      { date: "Vie", label: "11 Sep", completed: 18, created: 9 },
      { date: "Sáb", label: "12 Sep", completed: 14, created: 5 },
      { date: "Dom", label: "13 Sep", completed: Math.max(doneTasks * 2, 9), created: 7 },
    ];
  } else if (range === "90d") {
    throughputTimeline = [
      { date: "Sem 1", label: "Jul 1-7", completed: 42, created: 38 },
      { date: "Sem 3", label: "Jul 15-21", completed: 58, created: 45 },
      { date: "Sem 5", label: "Ago 1-7", completed: 64, created: 52 },
      { date: "Sem 7", label: "Ago 15-21", completed: 71, created: 60 },
      { date: "Sem 9", label: "Sep 1-7", completed: 85, created: 68 },
      { date: "Sem 11", label: "Sep 15-21", completed: 92, created: 74 },
    ];
  } else {
    // 30d default
    throughputTimeline = [
      { date: "15 Ago", label: "Sem 1", completed: 18, created: 14 },
      { date: "20 Ago", label: "Sem 2", completed: 24, created: 19 },
      { date: "25 Ago", label: "Sem 3", completed: 29, created: 22 },
      { date: "30 Ago", label: "Sem 4", completed: 35, created: 28 },
      { date: "05 Sep", label: "Sem 5", completed: 42, created: 31 },
      { date: "12 Sep", label: "Sem 6", completed: Math.max(doneTasks * 4, 38), created: 26 },
    ];
  }

  // Workload per user
  const assigneeWorkload: AssigneeWorkloadData[] = DEMO_USERS.map((user, idx) => {
    const userTasks = tasks.filter((t) => t.assignee?.id === user.id);
    const userDone = userTasks.filter((t) => t.status === "done").length;
    const userProg = userTasks.filter((t) => t.status === "in_progress").length;
    const userBack = userTasks.filter((t) => t.status === "todo" || t.status === "backlog").length;

    // Provide realistic baselines augmented with active tasks
    const baselineDone = [18, 14, 4][idx] || 5;
    const baselineProg = [4, 3, 1][idx] || 2;
    const baselineBack = [6, 5, 2][idx] || 3;

    return {
      userId: user.id,
      userName: user.name,
      initials: user.initials,
      completed: baselineDone + userDone,
      inProgress: baselineProg + userProg,
      backlog: baselineBack + userBack,
      total: baselineDone + userDone + baselineProg + userProg + baselineBack + userBack,
    };
  });

  // Priority breakdown
  const urgentCount = tasks.filter((t) => t.priority === "urgent").length + 6;
  const highCount = tasks.filter((t) => t.priority === "high").length + 18;
  const mediumCount = tasks.filter((t) => t.priority === "medium").length + 32;
  const lowCount = tasks.filter((t) => t.priority === "low").length + 14;
  const totalPriorities = urgentCount + highCount + mediumCount + lowCount;

  const priorityBreakdown: PriorityBreakdownData[] = [
    {
      priority: "urgent",
      label: "Urgente",
      count: urgentCount,
      percentage: Math.round((urgentCount / totalPriorities) * 100),
      color: "hsl(0 84% 60%)", // Red
    },
    {
      priority: "high",
      label: "Alta",
      count: highCount,
      percentage: Math.round((highCount / totalPriorities) * 100),
      color: "hsl(38 92% 50%)", // Amber
    },
    {
      priority: "medium",
      label: "Media",
      count: mediumCount,
      percentage: Math.round((mediumCount / totalPriorities) * 100),
      color: "hsl(217 91% 60%)", // Blue
    },
    {
      priority: "low",
      label: "Baja",
      count: lowCount,
      percentage: Math.round((lowCount / totalPriorities) * 100),
      color: "hsl(220 14% 60%)", // Neutral gray
    },
  ];

  // Live telemetry feed
  const liveTelemetry: TelemetryLog[] = [
    {
      id: "telem-1",
      timestamp: "15:28:44",
      actor: "Gabriel Gonçalves (Admin)",
      action: "MUTATION_COMMIT",
      target: "PATCH /api/tasks/NP-105",
      latencyMs: 14,
      status: "200 OK",
    },
    {
      id: "telem-2",
      timestamp: "15:28:40",
      actor: "Nexus Workflow Engine",
      action: "PIPELINE_RUN",
      target: "POST /api/workflows/wf-1/run",
      latencyMs: 24,
      status: "200 OK",
    },
    {
      id: "telem-3",
      timestamp: "15:28:32",
      actor: "Elena Rostova (PM)",
      action: "OPTIMISTIC_INSERT",
      target: "POST /api/tasks",
      latencyMs: 18,
      status: "201 Created",
    },
    {
      id: "telem-4",
      timestamp: "15:28:15",
      actor: "Edge Middleware",
      action: "SECURITY_HEADER_CHECK",
      target: "GET /analytics",
      latencyMs: 8,
      status: "200 OK",
    },
    {
      id: "telem-5",
      timestamp: "15:27:58",
      actor: "TanStack Query Cache",
      action: "BACKGROUND_REVALIDATE",
      target: "GET /api/workflows",
      latencyMs: 12,
      status: "304 Cached",
    },
  ];

  return {
    timeRange: range,
    overview: {
      totalTasksCompleted: doneTasks + (range === "7d" ? 42 : range === "90d" ? 340 : 128),
      tasksCompletedChange: range === "7d" ? 18.4 : 14.2,
      avgCycleTimeHours: range === "7d" ? 11.2 : 14.6,
      cycleTimeChange: -16.5,
      workflowSuccessRate: avgWorkflowSuccess,
      workflowRuns: totalWorkflowRuns,
      slaComplianceRate: 97.2,
    },
    throughputTimeline,
    assigneeWorkload,
    priorityBreakdown,
    liveTelemetry,
  };
}
