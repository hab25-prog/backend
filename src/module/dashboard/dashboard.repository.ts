import { promisify } from "node:util";
import { prisma } from "../../config/prisma.js";
import type {
  DashboardActivity,
  DashboardNotification,
  DashboardProject,
  DashboardProjectSummary,
  DashboardTask,
  DashboardTaskSummary,
} from "./dashboard.types.js";

export class DashboardRepository {
  async getWorkSpaceCount(userId: string): Promise<number> {
    const data = await prisma.workspaceMember.count({
      where: {
        userId: userId,
      },
    });
    return data;
  }
  async getProjectStatistics(userId: string): Promise<DashboardProjectSummary> {
    const [active, completed, archived] = await Promise.all([
      prisma.project.count({
        where: {
          members: {
            some: {
              userId: userId,
            },
          },
          status: "ACTIVE",
        },
      }),
      prisma.project.count({
        where: {
          members: {
            some: {
              userId: userId,
            },
          },
          status: "COMPLETED",
        },
      }),
      prisma.project.count({
        where: {
          members: {
            some: {
              userId: userId,
            },
          },
          status: "ARCHIVED",
        },
      }),
    ]);
    return {
      active,
      completed,
      archived,
    };
  }
  async getTaskStatistics(userId: string): Promise<DashboardTaskSummary> {
    const [todo, inProgress, review, done] = await Promise.all([
      prisma.task.count({
        where: {
          assigneeId: userId,
          status: "TODO",
        },
      }),
      prisma.task.count({
        where: {
          assigneeId: userId,
          status: "IN_PROGRESS",
        },
      }),
      prisma.task.count({
        where: {
          assigneeId: userId,
          status: "REVIEW",
        },
      }),
      prisma.task.count({
        where: {
          assigneeId: userId,
          status: "DONE",
        },
      }),
    ]);
    return { todo, inProgress, review, done };
  }
  async getOverdueTaskCount(userId: string): Promise<number> {
    return await prisma.task.count({
      where: {
        assigneeId: userId,
        dueDate: {
          lt: new Date(),
        },
        status: {
          not: "DONE",
        },
      },
    });
  }
  async getAssignedTasks(userId: string): Promise<DashboardTask[]> {
    const data = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: "IN_PROGRESS",
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    });
    const tasks = data.map((d) => ({
      ...d,
      projectName: d.project.name,
    }));
    return tasks as DashboardTask[];
  }
  async getUpcomingTasks(userId: string): Promise<DashboardTask[]> {
    const data = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: "TODO",
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    });
    const tasks = data.map((d) => ({
      ...d,
      projectName: d.project.name,
    }));
    return tasks as DashboardTask[];
  }

  async getRecentProjects(userId: string): Promise<DashboardProject[]> {
    const data = await prisma.project.findMany({
      where: {
        members: {
          every: {
            userId: userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });
    return data as DashboardProject[];
  }
  async getRecentActivity(userId: string): Promise<DashboardActivity[]> {
    const data = await prisma.activity.findMany({
      where: {
        actorId: userId,
      },
      take: 10,
    });
    return data as DashboardActivity[];
  }
  async getUnreadNotificationCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
  }
  async getRecentNotifications(
    userId: string,
  ): Promise<DashboardNotification[]> {
    const data = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
    return data as DashboardNotification[];
  }
}
/*
  dashboard.repository.ts

├── getWorkspaceCount()
├── getProjectStatistics()
├── getTaskStatistics()
├── getOverdueTaskCount()
├── getAssignedTasks()
├── getUpcomingTasks()
├── getRecentProjects()
├── getRecentActivity()
├── getUnreadNotificationCount()
└── getRecentNotifications()
*/
