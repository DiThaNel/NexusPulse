export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type UserRole = "admin" | "engineer" | "product_manager" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  title: string;
  role: UserRole;
  avatarUrl?: string;
}

export const DEMO_USERS: User[] = [
  {
    id: "user-1",
    name: "Gabriel Gonçalves",
    email: "gabriel@nexus-pulse.dev",
    initials: "GG",
    title: "Tech Lead & Architect",
    role: "admin",
  },
  {
    id: "user-2",
    name: "Elena Rostova",
    email: "elena@nexus-pulse.dev",
    initials: "ER",
    title: "Product Manager",
    role: "product_manager",
  },
  {
    id: "user-3",
    name: "Lucas Silva",
    email: "lucas@nexus-pulse.dev",
    initials: "LS",
    title: "Guest Viewer",
    role: "viewer",
  },
];

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  tags: string[];
  dueDate?: string;
  estimateHours?: number;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowTriggerType = "webhook" | "cron" | "event" | "manual";
export type WorkflowStatus = "active" | "paused" | "draft";

export interface WorkflowStep {
  id: string;
  name: string;
  type: "trigger" | "condition" | "action";
  actionType?: "slack_notify" | "github_deploy" | "database_archive" | "task_auto_assign";
  configLabel: string;
  status?: "idle" | "running" | "success" | "failure";
}

export interface WorkflowRunLog {
  id: string;
  timestamp: string;
  level: "info" | "success" | "warn" | "error";
  message: string;
  stepId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTriggerType;
  triggerDetail: string;
  status: WorkflowStatus;
  runsCount: number;
  successRate: number;
  lastRunAt?: string;
  lastRunStatus?: "success" | "failure" | "running" | "idle";
  steps: WorkflowStep[];
  recentLogs?: WorkflowRunLog[];
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  changePercent: number;
  trend: "up" | "down" | "neutral";
  description: string;
  iconName: string;
}

export interface ActivityEvent {
  id: string;
  actor: User;
  action: string;
  target: string;
  timestamp: string;
  category: "task" | "workflow" | "deploy" | "alert";
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  isExternal?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
