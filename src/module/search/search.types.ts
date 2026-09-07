import type { ConversationMembers } from "../../../generated/prisma/browser.js";

export type SearchQuery = {
  q: string;
  limit?: number;
};

export type SearchServiceInput = {
  query: string;
  userId: string;
  limit: number;
};
export type UserSearchResult = {
  id: string;
  username: string;
  fullName: string;
  profileImage: string | null;
};
export type ProjectSearchResult = {
  id: string;
  name: string;
  description: string | null;
  status: string;
};
export type TaskSearchResult = {
  id: string;
  title: string;
  status: string;
  priority: string;
  projectId: string;
};
export type WorkspaceSearchResult = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
};
export type FileSearchResult = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  workspaceId: string;
};
export type ConversationSearchResult = {
  id: string;
  name: any;
  participants: ConversationMembers[];
};
export type MessageSearchResult = {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  // timestamp: string;
};
export type SearchResult = {
  users: UserSearchResult[];
  workspaces: WorkspaceSearchResult[];
  projects: ProjectSearchResult[];
  tasks: TaskSearchResult[];
  // files: FileSearchResult[];
  conversations: ConversationSearchResult[];
  messages: MessageSearchResult[];
};
