import { WorkSpaceService } from "../work_space/workSpace.service.js";
import { SearchRepository } from "./search.repository.js";
import type { SearchResult, SearchServiceInput } from "./search.types.js";

const searchRepository = new SearchRepository();
const workspaceService = new WorkSpaceService();
export class SearchService {
  async search(data: SearchServiceInput): Promise<SearchResult> {
    const [users, workSpace, project, task, conversation, message] =
      await Promise.all([
        searchRepository.searchUsers(
          {
            q: data.query,
            limit: data.limit,
          },
          data.userId,
        ),
        searchRepository.searchWorkspaces({
          q: data.query,
          limit: data.limit,
        }),
        searchRepository.searchProjects({
          q: data.query,
          limit: data.limit,
        }),
        searchRepository.searchTasks({
          q: data.query,
          limit: data.limit,
        }),

        searchRepository.searchConversations({
          q: data.query,
          limit: data.limit,
        }),
        searchRepository.searchMessages({
          q: data.query,
          limit: data.limit,
        }),
      ]);
    const workspaces = workSpace.filter((w) =>
      w.members.some((m) => m.userId == data.userId),
    );
    const projects = project.filter((p) =>
      p.members.some((m) => m.userId == data.userId),
    );
    const tasks = task.filter((t) => projects.some((p) => p.id == t.projectId));
    const conversations = conversation.filter((c) =>
      c.participants.some((p) => p.userId == data.userId),
    );
    const messages = message.filter((m) =>
      conversations.some((c) => c.id == m.conversationId),
    );
    return { users, workspaces, projects, tasks, conversations, messages };
  }
}
