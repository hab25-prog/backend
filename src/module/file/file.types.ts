export interface CreateFileInput {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  storageKey: string;

  uploadedById: string;

  taskId?: string;
  projectId?: string;
  workspaceId?: string;
  commentId?: string;
}