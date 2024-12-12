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
import { PostRepository } from "../../Domain/Repositories/PostRepository";
import { PrismaPostRepository } from "../Repositories/PrismaPostRepository";
import { GetAllPosts } from "../../Application/UseCases/Post/GetAllPosts";
import { GetPostById } from "../../Application/UseCases/Post/GetPostById";
import { GetUserPosts } from "../../Application/UseCases/Post/getUserPosts";
import { CreatePost } from "../../Application/UseCases/Post/CreatePost";
import { DeletePost } from "../../Application/UseCases/Post/DeletePost";
import { UpdatePost } from "../../Application/UseCases/Post/UpdatePost";

export function setupContainer() {
  container.registerSingleton<UserRepository>(
    "UserRepository",
    PrismaUserRepository,
  );

  container.registerSingleton<PostRepository>(
    "PostRepository",
    PrismaPostRepository,
  );
}

//Register User use cases
container.registerSingleton("GetAllUsers", GetAllUsers);
container.registerSingleton("GetUserById", GetUserById);
container.registerSingleton("CreateUser", CreateUser);
container.registerSingleton("DeleteUser", DeleteUser);
container.registerSingleton("DisableUser", DisableUser);
container.registerSingleton("SwitchUserRole", SwitchUserRole);
container.registerSingleton("UpdateUser", UpdateUser);

//Register Post use cases

container.registerSingleton("GetAllPosts", GetAllPosts);
container.registerSingleton("GetPostById", GetPostById);
container.registerSingleton("GetUserPosts", GetUserPosts);
container.registerSingleton("CreatePost", CreatePost);
container.registerSingleton("DeletePost", DeletePost);
container.registerSingleton("UpdatePost", UpdatePost);
