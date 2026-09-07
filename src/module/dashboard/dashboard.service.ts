import { DashboardRepository } from "./dashboard.repository.js";
import type { DashboardResponse } from "./dashboard.types.js";
const dashboardRepo = new DashboardRepository();
export class DashboardService {
  async getDashboard(userId: string): Promise<DashboardResponse> {
    
    const [
      workspaceCount,
      projectStatistics,
      taskStatistics,
      overdueTaskCount,
      assignedTasks,
      upcomingTasks,
      recentProjects,
      recentActivity,
      unreadNotificationCount,
      recentNotifications,
    ] = await Promise.all([
      await dashboardRepo.getWorkSpaceCount(userId),
      await dashboardRepo.getProjectStatistics(userId),
      await dashboardRepo.getTaskStatistics(userId),
      await dashboardRepo.getOverdueTaskCount(userId),
      await dashboardRepo.getAssignedTasks(userId),
      await dashboardRepo.getUpcomingTasks(userId),
      await dashboardRepo.getRecentProjects(userId),
      await dashboardRepo.getRecentActivity(userId),
      await dashboardRepo.getUnreadNotificationCount(userId),
      await dashboardRepo.getRecentNotifications(userId),
    ]);

    return {
      overview: {
        totalWorkSpace: workspaceCount,
        totalProjects:
          projectStatistics.active +
          projectStatistics.completed +
          projectStatistics.archived,

        activeProjects: projectStatistics.active,
        completedProjects: projectStatistics.completed,
        archivedProjects: projectStatistics.archived,

        totalTasks:
          taskStatistics.todo +
          taskStatistics.inProgress +
          taskStatistics.review +
          taskStatistics.done,

        completedTasks: taskStatistics.done,

        overdueTasks: overdueTaskCount,
      },

      projectSummary: projectStatistics,

      taskSummary: taskStatistics,

      assignedTasks,

      upcomingTasks,

      recentProjects,

      recentActivity,

      notifications: {
        unreadCount: unreadNotificationCount,
        recent: recentNotifications,
      },
    };
  }
}
/*
  overview: {
             totalWorkSpace: number;
             totalProjects: number;
             activeProjects: number;
             completedProjects: number;
             archivedProjects: number;
             totalTasks: number;
             completedTasks: number;
             overdueTasks: number;
             };
  projectSummary: DashboardProjectSummary;
  taskSummary: DashboardTaskSummary;
  assignedTask: DashboardTask[];
  upcomingTasks: DashboardTask[];
  recentProjects: DashboardProject[];
  recentActivity: DashboardActivity[];
  notifications: {
    unreadCount: number;
    recent: DashboardNotification[];
  };
*/
