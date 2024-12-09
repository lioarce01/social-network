import "reflect-metadata";
import { container } from "tsyringe";
import { UserRepository } from "../../Domain/Repositories/UserRepository";
import { PrismaUserRepository } from "../Repositories/PrismaUserRepository";
import { GetAllUsers } from "../../Application/UseCases/User/GetAllUsers";
import { GetUserById } from "../../Application/UseCases/User/GetUserById";
import { CreateUser } from "../../Application/UseCases/User/CreateUser";
import { DeleteUser } from "../../Application/UseCases/User/DeleteUser";
import { DisableUser } from "../../Application/UseCases/User/DisableUser";
import { SwitchUserRole } from "../../Application/UseCases/User/SwitchUserRole";
import { UpdateUser } from "../../Application/UseCases/User/updateUser";

export function setupContainer() {
  container.registerSingleton<UserRepository>(
    "UserRepository",
    PrismaUserRepository,
  );
}

//Register use cases
container.registerSingleton("GetAllUsers", GetAllUsers);
container.registerSingleton("GetUserById", GetUserById);
container.registerSingleton("CreateUser", CreateUser);
container.registerSingleton("DeleteUser", DeleteUser);
container.registerSingleton("DisableUser", DisableUser);
container.registerSingleton("SwitchUserRole", SwitchUserRole);
container.registerSingleton("UpdateUser", UpdateUser);
