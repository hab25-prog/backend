import type { Task } from "../../../generated/prisma/client.js";
import type {
  NotificationType,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "../../../generated/prisma/enums.js";

export interface DashboardOverview {
  totalWorkSpace: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  archivedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}
export interface DashboardProjectSummary {
  active: number;
  completed: number;
  archived: number;
}
export interface DashboardTaskSummary {
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}
export interface DashboardProject {
  id: string;
  name: string;
  status: ProjectStatus;
  updatedAt: Date;
  memberCount: number;
  description: string;
  task: Task[];
}
export interface DashboardTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string;
  projectName: string;
}
export interface DashboardActivity {
  id: string;
  action: string;
  description: string;
  actorId: string;
  //   actorName: string;
  createdAt: Date;
}
export interface DashboardNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
export interface DashboardResponse {
  overview: DashboardOverview;
  projectSummary: DashboardProjectSummary;
  taskSummary: DashboardTaskSummary;
  assignedTasks: DashboardTask[];
  upcomingTasks: DashboardTask[];
  recentProjects: DashboardProject[];
  recentActivity: DashboardActivity[];
  notifications: {
    unreadCount: number;
    recent: DashboardNotification[];
  };
}
