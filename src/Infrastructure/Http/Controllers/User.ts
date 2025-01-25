import { NextFunction, Request, Response } from "express";
import { GetAllUsers } from "../../../Application/UseCases/User/GetAllUsers";
import { inject, injectable } from "tsyringe";
import { GetUserByIdentifier } from "../../../Application/UseCases/User/GetUserBySub";
import { UpdateUser } from "../../../Application/UseCases/User/updateUser";
import { DeleteUser } from "../../../Application/UseCases/User/DeleteUser";
import { CreateUser } from "../../../Application/UseCases/User/CreateUser";
import { DisableUser } from "../../../Application/UseCases/User/DisableUser";
import { SwitchUserRole } from "../../../Application/UseCases/User/SwitchUserRole";
import { Role } from "@prisma/client";
import { FollowUser } from "../../../Application/UseCases/User/FollowUser";
import { UnfollowUser } from "../../../Application/UseCases/User/UnfollowUser";
import { GetUserApplications } from "../../../Application/UseCases/User/GetUserApplications";
import { GetUserJobPostings } from "../../../Application/UseCases/User/GetUserJobPostings";
import { GetUserLikedPosts } from "../../../Application/UseCases/User/GetUserLikedPosts";

@injectable()
export class UserController {
  constructor(
    @inject(GetAllUsers) private getAllUsersUseCase: GetAllUsers,
    @inject(GetUserByIdentifier)
    private getUserByIdentifierUseCase: GetUserByIdentifier,
    @inject(UpdateUser) private updateUserUseCase: UpdateUser,
    @inject(DeleteUser) private deleteUserUseCase: DeleteUser,
    @inject(CreateUser) private createUserUseCase: CreateUser,
    @inject(DisableUser) private disableUserUseCase: DisableUser,
    @inject(SwitchUserRole) private switchUserRoleUseCase: SwitchUserRole,
    @inject(FollowUser) private followUserUseCase: FollowUser,
    @inject(UnfollowUser) private unfollowUserUseCase: UnfollowUser,
    @inject(GetUserApplications)
    private getUserApplicationsUseCase: GetUserApplications,
    @inject(GetUserJobPostings)
    private getUserJobPostingsUseCase: GetUserJobPostings,
    @inject(GetUserLikedPosts)
    private getUserLikedPostsUseCase: GetUserLikedPosts,
  ) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset, limit, role } = req.query;

      const filters = {
        role: role as Role,
      };

      const parsedOffset =
        typeof offset === "string" && offset.trim() !== ""
          ? Number(offset)
          : undefined;
      const parsedLimit =
        typeof limit === "string" && limit.trim() !== ""
          ? Number(limit)
          : undefined;

      const users = await this.getAllUsersUseCase.execute(
        filters,
        parsedOffset,
        parsedLimit,
      );

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        sub,
        profile_pic,
        followingCount = 0,
        followersCount = 0,
      } = req.body;

      const { message, user } = await this.createUserUseCase.execute({
        name,
        email,
        sub,
        profile_pic,
        enabled: true,
        role: Role.USER,
        followingCount,
        followersCount,
      });

      res.status(201).json({ message, user });
    } catch (error: any) {
      if (error.message === "User already exists") {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }

  async getUserByIdentifier(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier } = req.params;
      const user = await this.getUserByIdentifierUseCase.execute(identifier);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { ...body } = req.body;

      const { message, user } = await this.updateUserUseCase.execute(id, body);

      res.status(200).json({ message, user });
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { message } = await this.deleteUserUseCase.execute(id);

      res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  async disableUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const { message, user } = await this.disableUserUseCase.execute(id);

      res.status(200).json({ message, user });
    } catch (e) {
      next(e);
    }
  }

  async switchUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const { message, user } = await this.switchUserRoleUseCase.execute(id);

      res.status(200).json({ message, user });
    } catch (e) {
      next(e);
    }
  }

  async followUser(req: Request, res: Response, next: NextFunction) {
    const { userId, followingId } = req.body;
    try {
      const followRelation = await this.followUserUseCase.execute(
        userId,
        followingId,
      );

      return res.status(201).json(followRelation);
    } catch (e) {
      next(e);
    }
  }

  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    const { userId, followingId } = req.body;

    try {
      const { message } = await this.unfollowUserUseCase.execute(
        userId,
        followingId,
      );

      return res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  async getUserApplications(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body;

    try {
      const result = await this.getUserApplicationsUseCase.execute(userId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async getUserJobPostings(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await this.getUserJobPostingsUseCase.execute(
        id,
        offset,
        limit,
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async getUserLikedPosts(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await this.getUserLikedPostsUseCase.execute(
        id,
        offset,
        limit,
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}
