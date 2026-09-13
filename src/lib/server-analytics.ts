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
import { getServerTelemetry } from "./server-telemetry";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getServerAnalytics(
  range: AnalyticsTimeRange = "30d"
): Promise<AnalyticsPayload> {
  await delay(60);

  const [tasks, workflows, telemetry] = await Promise.all([
    getServerTasks(),
    getServerWorkflows(),
    getServerTelemetry(),
  ]);

  // Compute live task counts directly from active Kanban board
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in_progress" || t.status === "in_review"
  ).length;
  const backlogTasks = tasks.filter(
    (t) => t.status === "backlog" || t.status === "todo"
  ).length;
  const totalTasks = tasks.length;

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

  // Timeline points based on range, with current period dynamically reflecting doneTasks
  let throughputTimeline: ThroughputDataPoint[] = [];

  if (range === "7d") {
    throughputTimeline = [
      { date: "Lun", label: "07 Sep", completed: 8, created: 6 },
      { date: "Mar", label: "08 Sep", completed: 12, created: 10 },
      { date: "Mié", label: "09 Sep", completed: 15, created: 8 },
      { date: "Jue", label: "10 Sep", completed: 11, created: 14 },
      { date: "Vie", label: "11 Sep", completed: 18, created: 9 },
      { date: "Sáb", label: "12 Sep", completed: 14, created: 5 },
      {
        date: "Dom",
        label: "Hoy (13 Sep)",
        completed: Math.max(doneTasks * 3 + 4, 6),
        created: 7,
      },
    ];
  } else if (range === "90d") {
    throughputTimeline = [
      { date: "Sem 1", label: "Jul 1-7", completed: 42, created: 38 },
      { date: "Sem 3", label: "Jul 15-21", completed: 58, created: 45 },
      { date: "Sem 5", label: "Ago 1-7", completed: 64, created: 52 },
      { date: "Sem 7", label: "Ago 15-21", completed: 71, created: 60 },
      { date: "Sem 9", label: "Sep 1-7", completed: 85, created: 68 },
      {
        date: "Sem 11",
        label: "Esta semana",
        completed: 75 + doneTasks * 4,
        created: 74,
      },
    ];
  } else {
    // 30d default
    throughputTimeline = [
      { date: "15 Ago", label: "Sem 1", completed: 18, created: 14 },
      { date: "20 Ago", label: "Sem 2", completed: 24, created: 19 },
      { date: "25 Ago", label: "Sem 3", completed: 29, created: 22 },
      { date: "30 Ago", label: "Sem 4", completed: 35, created: 28 },
      { date: "05 Sep", label: "Sem 5", completed: 42, created: 31 },
      {
        date: "12 Sep",
        label: "Sem 6 (Actual)",
        completed: 20 + doneTasks * 4,
        created: 26,
      },
    ];
  }

  // Workload per user directly from real-time assigned tasks
  const assigneeWorkload: AssigneeWorkloadData[] = DEMO_USERS.map((user) => {
    const userTasks = tasks.filter((t) => t.assignee?.id === user.id);
    const completed = userTasks.filter((t) => t.status === "done").length;
    const inProgress = userTasks.filter(
      (t) => t.status === "in_progress" || t.status === "in_review"
    ).length;
    const backlog = userTasks.filter(
      (t) => t.status === "todo" || t.status === "backlog"
    ).length;
    const total = completed + inProgress + backlog;

    return {
      userId: user.id,
      userName: user.name,
      initials: user.initials,
      completed,
      inProgress,
      backlog,
      total: total > 0 ? total : 1,
    };
  });

  // Priority breakdown directly from real-time tasks
  const urgentCount = tasks.filter((t) => t.priority === "urgent").length;
  const highCount = tasks.filter((t) => t.priority === "high").length;
  const mediumCount = tasks.filter((t) => t.priority === "medium").length;
  const lowCount = tasks.filter((t) => t.priority === "low").length;
  const totalPriorities = Math.max(
    urgentCount + highCount + mediumCount + lowCount,
    1
  );

  const priorityBreakdown: PriorityBreakdownData[] = [
    {
      priority: "urgent",
      label: "Urgente",
      count: urgentCount,
      percentage: Math.round((urgentCount / totalPriorities) * 100),
      color: "hsl(0 84% 60%)",
    },
    {
      priority: "high",
      label: "Alta",
      count: highCount,
      percentage: Math.round((highCount / totalPriorities) * 100),
      color: "hsl(38 92% 50%)",
    },
    {
      priority: "medium",
      label: "Media",
      count: mediumCount,
      percentage: Math.round((mediumCount / totalPriorities) * 100),
      color: "hsl(217 91% 60%)",
    },
    {
      priority: "low",
      label: "Baja",
      count: lowCount,
      percentage: Math.round((lowCount / totalPriorities) * 100),
      color: "hsl(220 14% 60%)",
    },
  ];

  // Dynamic cycle time: lower when more tasks are completed vs pending
  const dynamicCycleTime = Number(
    Math.max(2.4, 6.2 + inProgressTasks * 1.1 - doneTasks * 0.8).toFixed(1)
  );

  // Dynamic SLA compliance: rises with completed tasks
  const dynamicSla = Number(
    Math.min(99.9, 91.5 + (doneTasks / Math.max(totalTasks, 1)) * 8.2).toFixed(1)
  );

  return {
    timeRange: range,
    overview: {
      totalTasksCompleted: doneTasks,
      tasksCompletedChange: doneTasks > 2 ? 24.5 : 12.0,
      avgCycleTimeHours: dynamicCycleTime,
      cycleTimeChange: -18.4,
      workflowSuccessRate: avgWorkflowSuccess,
      workflowRuns: totalWorkflowRuns,
      slaComplianceRate: dynamicSla,
    },
    throughputTimeline,
    assigneeWorkload,
    priorityBreakdown,
    liveTelemetry: telemetry.slice(0, 10),
  };
}
