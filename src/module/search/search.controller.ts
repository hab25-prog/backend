import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { SearchService } from "./search.service.js";
import type { SearchServiceInput } from "./search.types.js";

const searchService = new SearchService();
export const searchAll = async (req: AuthenticatedRequest, res: Response) => {
  const query = req.query.query;
  const userId = req.user?.id;
  const data = await searchService.search({
    query: query,
    limit: 10,
    userId: userId,
  } as SearchServiceInput);
  res.status(201).json({ status: true, data: data });
};
