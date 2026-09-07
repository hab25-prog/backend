import bcrypt from "bcrypt";
import { UserRepository } from "./user.repository.js";
import { email } from "zod";
import { ConflictError } from "../../shared/errors/ConflictError.js";
import { NoteFoundError } from "../../shared/errors/NotFoundError.js";
import { UnauthorizedError } from "../../shared/errors/UnauthorizedError.js";
import { NotificationService } from "../Notification/notification.service.js";
import { ActivityService } from "../activity/activity.service.js";
import type { CreateActivityInput } from "../activity/activity.types.js";
// import { authMiddleWare } from "../../middleware/auth.middleware.js";

const userRepository = new UserRepository();
const notficationService = new NotificationService();
const activityService = new ActivityService();
export class UserService {
  private async createNotficationForRegstration(data: { userId: string }) {
    const not = await notficationService.createNotification({
      message: "congratulation you are successfully reigster 🎉🎉🎉",
      recipientId: data.userId,
      title: "Register confirmation",
      type: "SYSTEM",
    });
  }
  async register(data: {
    email: string;
    username: string;
    password: string;
    fullName?: string;
    description?: string;
  }) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("the user already sigin");
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await userRepository.regsiterUser(
      {
        email: data.email,
        username: data.username,
        passwordHash,
        fullName: data.fullName ?? "",
      },
      {
        name: `${data.fullName}_default`,
        ...(data.description && {
          description: data.description,
        }),
      },
    );
    this.createNotficationForRegstration({ userId: user.id });
    activityService.createActivity({
      action: "CREATE",
      targetId: user.id,
      targetType: "USER",
      metadata: {
        message: "user registerd at this time",
      },
    } as CreateActivityInput);
    return user;
  }

  async loginUser(userName: string, password: string) {
    const user = await userRepository.findUserByUName(userName);
    if (!user) {
      throw new NoteFoundError("the user is not found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      throw new UnauthorizedError("the password is not correct");
    }
    activityService.createActivity({
      action: "LOGIN",
      targetId: user.id,
      targetType: "USER",
      metadata: {
        message: "the user logged in",
      },
    } as CreateActivityInput);
    return user;
  }

  async getUser(data: { username?: string; id?: string }) {
    if (data.username)
      return await userRepository.findUserByUName(data.username);
    if (data.id) {
      const user = await userRepository.findUserById(data.id);
      if (!user) {
        throw new UnauthorizedError("the user no longer have in this system");
      }
      return user;
    }
  }
}
