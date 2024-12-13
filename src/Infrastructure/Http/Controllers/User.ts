import { NextFunction, Request, Response } from "express";
import { GetAllUsers } from "../../../Application/UseCases/User/GetAllUsers";
import { inject, injectable } from "tsyringe";
import { GetUserById } from "../../../Application/UseCases/User/GetUserById";
import { UpdateUser } from "../../../Application/UseCases/User/updateUser";
import { DeleteUser } from "../../../Application/UseCases/User/DeleteUser";
import { CreateUser } from "../../../Application/UseCases/User/CreateUser";
import { DisableUser } from "../../../Application/UseCases/User/DisableUser";
import { SwitchUserRole } from "../../../Application/UseCases/User/SwitchUserRole";
import { Role } from "@prisma/client";

@injectable()
export class UserController {
  constructor(
    @inject(GetAllUsers) private getAllUsersUseCase: GetAllUsers,
    @inject(GetUserById) private getUserByIdUseCase: GetUserById,
    @inject(UpdateUser) private updateUserUseCase: UpdateUser,
    @inject(DeleteUser) private deleteUserUseCase: DeleteUser,
    @inject(CreateUser) private createUserUseCase: CreateUser,
    @inject(DisableUser) private disableUserUseCase: DisableUser,
    @inject(SwitchUserRole) private switchUserRoleUseCase: SwitchUserRole,
  ) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset, limit } = req.query;

      const parsedOffset =
        typeof offset === "string" && offset.trim() !== ""
          ? Number(offset)
          : undefined;
      const parsedLimit =
        typeof limit === "string" && limit.trim() !== ""
          ? Number(limit)
          : undefined;

      const users = await this.getAllUsersUseCase.execute(
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
      const { name, email, sub } = req.body;

      const userExist = await this.getUserByIdUseCase.execute(sub);

      if (userExist) {
        return res.status(409).json({ message: "User already exists" });
      }

      const { message, user } = await this.createUserUseCase.execute({
        name,
        email,
        sub,
        enabled: true,
        role: Role.USER,
      });
      res.status(201).json({ message, user });
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub } = req.params;
      const user = await this.getUserByIdUseCase.execute(sub);

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
      const { name } = req.body;

      const { message, user } = await this.updateUserUseCase.execute(id, {
        name,
      });

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
}
