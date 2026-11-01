import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { DashboardService } from "./dashboard.service.js";
const dashboardService = new DashboardService();
export const getDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const data = await dashboardService.getDashboard(userId as string);
  res.status(201).json({ status: true,  data });
};
