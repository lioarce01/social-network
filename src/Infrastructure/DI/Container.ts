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
import { CommentRepository } from "../../Domain/Repositories/CommentRepository";
import { PrismaCommentRepository } from "../Repositories/PrismaCommentRepository";
import { GetAllComments } from "../../Application/UseCases/Comment/GetAllComments";
import { GetUserComments } from "../../Application/UseCases/Comment/GetUserComments";
import { GetPostComments } from "../../Application/UseCases/Comment/GetPostComments";
import { CreateComment } from "../../Application/UseCases/Comment/CreateComment";
import { DeleteComment } from "../../Application/UseCases/Comment/DeleteComment";
import { UpdateComment } from "../../Application/UseCases/Comment/UpdateComment";
import { LikePost } from "../../Application/UseCases/PostLike/Like";
import { UnlikePost } from "../../Application/UseCases/PostLike/Unlike";
import { PostLikeRepository } from "../../Domain/Repositories/PostLikeRepository";
import { PrismaPostLikeRepository } from "../Repositories/PrismaPostLikeRepository";

export function setupContainer() {
  container.registerSingleton<UserRepository>(
    "UserRepository",
    PrismaUserRepository,
  );

  container.registerSingleton<PostRepository>(
    "PostRepository",
    PrismaPostRepository,
  );

  container.registerSingleton<CommentRepository>(
    "CommentRepository",
    PrismaCommentRepository,
  );

  container.registerSingleton<PostLikeRepository>(
    "PostLikeRepository",
    PrismaPostLikeRepository,
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

//Register Comment use cases
container.registerSingleton("GetAllComments", GetAllComments);
container.registerSingleton("GetUserComments", GetUserComments);
container.registerSingleton("GetPostComments", GetPostComments);
container.registerSingleton("CreateComment", CreateComment);
container.registerSingleton("DeleteComment", DeleteComment);
container.registerSingleton("UpdateComment", UpdateComment);

//Register PostLike use cases
container.registerSingleton("LikePost", LikePost);
container.registerSingleton("UnlikePost", UnlikePost);
