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
import { GetUserFollowers } from "../../../Application/UseCases/User/GetUserFollowers";
import { GetUserFollowing } from "../../../Application/UseCases/User/GetUserFollowing";

@injectable()
export class UserController {
  constructor(
    @inject("GetAllUsers") private getAllUsersUseCase: GetAllUsers,
    @inject("GetUserByIdentifier")
    private getUserByIdentifierUseCase: GetUserByIdentifier,
    @inject("UpdateUser") private updateUserUseCase: UpdateUser,
    @inject("DeleteUser") private deleteUserUseCase: DeleteUser,
    @inject("CreateUser") private createUserUseCase: CreateUser,
    @inject("DisableUser") private disableUserUseCase: DisableUser,
    @inject("SwitchUserRole") private switchUserRoleUseCase: SwitchUserRole,
    @inject("FollowUser") private followUserUseCase: FollowUser,
    @inject("UnfollowUser") private unfollowUserUseCase: UnfollowUser,
    @inject("GetUserApplications")
    private getUserApplicationsUseCase: GetUserApplications,
    @inject("GetUserJobPostings")
    private getUserJobPostingsUseCase: GetUserJobPostings,
    @inject("GetUserLikedPosts")
    private getUserLikedPostsUseCase: GetUserLikedPosts,
    @inject("GetUserFollowers")
    private getUserFollowersUseCase: GetUserFollowers,
    @inject("GetUserFollowing")
    private getUserFollowingUseCase: GetUserFollowing,
  ) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.query;
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters = {
        role: role as Role,
      };

      const users = await this.getAllUsersUseCase.execute(
        offset,
        limit,
        filters,
      );

      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, profile_pic } = req.body;

      const sub = req.auth?.sub!;

      if (!req.auth?.sub) {
        return res.status(400).json({ message: "Missing auth0 sub" });
      }

      const { message, user } = await this.createUserUseCase.execute({
        name,
        email,
        sub,
        profile_pic,
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

      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { ...body } = req.body;

      const { message, user } = await this.updateUserUseCase.execute(id, body);

      return res.status(200).json({ message, user });
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.auth?.sub;

      const { message } = await this.deleteUserUseCase.execute(userId!, id);

      return res.status(200).json({
        code: 200,
        message: message,
      });
    } catch (e) {
      next(e);
    }
  }

  async disableUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const adminId = req.auth?.sub;

      const { message } = await this.disableUserUseCase.execute(id, adminId!);

      return res.status(200).json({
        code: 200,
        message,
      });
    } catch (e) {
      next(e);
    }
  }

  async switchUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const adminId = req.auth?.sub;

      const { message } = await this.switchUserRoleUseCase.execute(
        id,
        adminId!,
      );

      return res.status(200).json({
        code: 200,
        message,
      });
    } catch (e) {
      next(e);
    }
  }

  async followUser(req: Request, res: Response, next: NextFunction) {
    const { followingId } = req.body;

    const userId = req.auth?.sub;

    try {
      const followRelation = await this.followUserUseCase.execute(
        userId!,
        followingId,
      );

      return res.status(201).json({
        code: 201,
        relation: followRelation,
      });
    } catch (e) {
      next(e);
    }
  }

  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    const { followingId } = req.body;

    const userId = req.auth?.sub;

    try {
      const { message } = await this.unfollowUserUseCase.execute(
        userId!,
        followingId,
      );

      return res.status(200).json({
        code: 200,
        message,
      });
    } catch (e) {
      next(e);
    }
  }

  async getUserApplications(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await this.getUserApplicationsUseCase.execute(
        id,
        offset,
        limit,
      );

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

  async getUserFollowers(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await this.getUserFollowersUseCase.execute(
        id,
        offset,
        limit,
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async getUserFollowing(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const result = await this.getUserFollowingUseCase.execute(
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
