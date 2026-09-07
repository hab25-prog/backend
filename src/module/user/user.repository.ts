import { prisma } from "../../config/prisma.js";
import type { CreateWorkspaceInput } from "../work_space/workspace.type.js";
import type { CreateUserInput } from "./user.type.js";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id: id } });
  }
  async findUserByUName(username: string) {
    return await prisma.user.findUnique({ where: { username: username } });
  }
  async regsiterUser(
    userData: CreateUserInput,
    workSpaceData: CreateWorkspaceInput,
  ) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: userData,
      });
      const workspace = await tx.workspace.create({
        data: {
          name: workSpaceData.name,
          ...(workSpaceData.description && {
            description: workSpaceData.description,
          }),
          ownerId: user.id,
        },
      });
      const workspace_member = await tx.workspaceMember.create({
        data: {
          role: "OWNER",
          userId: user.id,
          workspaceId: workspace.id,
        },
      });

      return user;
    });
  }
  async getWorkSpace(id: string, workSpaceId: string) {
    return await prisma.workspaceMember.findUnique({
      where: { id: id, workspaceId: workSpaceId },
    });
  }
}
