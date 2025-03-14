import "reflect-metadata";
import { container } from "tsyringe";
import { UserRepository } from "../../Domain/Repositories/UserRepository";
import { PrismaUserRepository } from "../Repositories/PrismaUserRepository";
import { GetAllUsers } from "../../Application/UseCases/User/GetAllUsers";
import { GetUserByIdentifier } from "../../Application/UseCases/User/GetUserBySub";
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
import { JobPostingRepository } from "../../Domain/Repositories/JobPostingRepository";
import { PrismaJobPostingRepository } from "../Repositories/PrismaJobPostingRepository";
import { GetJobPostings } from "../../Application/UseCases/JobPosting/GetJobPostings";
import { GetJobPostingById } from "../../Application/UseCases/JobPosting/GetJobPostingById";
import { UpdateJobPosting } from "../../Application/UseCases/JobPosting/UpdateJobPosting";
import { CreateJobPosting } from "../../Application/UseCases/JobPosting/CreateJobPosting";
import { DeleteJobPosting } from "../../Application/UseCases/JobPosting/DeleteJobPosting";
import { DisableJobPosting } from "../../Application/UseCases/JobPosting/DisableJobPosting";
import { JobApplicationRepository } from "../../Domain/Repositories/JobApplicationRepository";
import { PrismaJobApplicationRepository } from "../Repositories/PrismaJobApplicationRepository";
import { ApplyJob } from "../../Application/UseCases/JobApplication/ApplyJob";
import { GetJobApplicants } from "../../Application/UseCases/JobPosting/GetJobApplicants";
import { FollowUser } from "../../Application/UseCases/User/FollowUser";
import { UnfollowUser } from "../../Application/UseCases/User/UnfollowUser";
import { GetUserApplications } from "../../Application/UseCases/User/GetUserApplications";
import { GetUserJobPostings } from "../../Application/UseCases/User/GetUserJobPostings";
import { GetUserLikedPosts } from "../../Application/UseCases/User/GetUserLikedPosts";
import { GetUserFollowers } from "../../Application/UseCases/User/GetUserFollowers";
import { GetUserFollowing } from "../../Application/UseCases/User/GetUserFollowing";
import { RejectApplicant } from "../../Application/UseCases/JobApplication/RejectApplicant";
import { RedisCacheRepository } from "../Repositories/RedisCacheRepository";
import { CacheRepository } from "../../Domain/Repositories/CacheRepository";
import { CacheService } from "../../Application/Services/CacheService";
import { AuthMiddleware } from "../Middlewares/auth";
import { GetMe } from "../../Application/UseCases/User/GetMe";
import { ServiceRepository } from "../../Domain/Repositories/ServiceRepository";
import { PrismaServiceRepository } from "../Repositories/PrismaServiceRepository";
import { GetServices } from "../../Application/UseCases/Service/GetServices";
import { GetServiceById } from "../../Application/UseCases/Service/GetServiceById";
import { CreateService } from "../../Application/UseCases/Service/CreateService";
import { UpdateService } from "../../Application/UseCases/Service/UpdateService";
import { DeleteService } from "../../Application/UseCases/Service/DeleteService";
import { SwitchStatus } from "../../Application/UseCases/Service/SwitchStatus";

export function setupContainer()
{
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

  container.registerSingleton<JobPostingRepository>(
    "JobPostingRepository",
    PrismaJobPostingRepository,
  );

  container.registerSingleton<JobApplicationRepository>(
    "JobApplicationRepository",
    PrismaJobApplicationRepository,
  );

  container.registerSingleton<CacheRepository>(
    "CacheRepository",
    RedisCacheRepository,
  );

  container.registerSingleton<ServiceRepository>(
    "ServiceRepository",
    PrismaServiceRepository
  )

  container.registerSingleton<CacheService>("CacheService", CacheService);

  container.registerSingleton("AuthMiddleware", AuthMiddleware);
}

//Register User use cases
container.registerSingleton("GetAllUsers", GetAllUsers);
container.registerSingleton("GetUserByIdentifier", GetUserByIdentifier);
container.registerSingleton("CreateUser", CreateUser);
container.registerSingleton("DeleteUser", DeleteUser);
container.registerSingleton("DisableUser", DisableUser);
container.registerSingleton("SwitchUserRole", SwitchUserRole);
container.registerSingleton("UpdateUser", UpdateUser);
container.registerSingleton("FollowUser", FollowUser);
container.registerSingleton("UnfollowUser", UnfollowUser);
container.registerSingleton("GetUserApplications", GetUserApplications);
container.registerSingleton("GetUserJobPostings", GetUserJobPostings);
container.registerSingleton("GetUserLikedPosts", GetUserLikedPosts);
container.registerSingleton("GetUserFollowers", GetUserFollowers);
container.registerSingleton("GetUserFollowing", GetUserFollowing);
container.registerSingleton("GetMe", GetMe)

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

//Register JobPosting use cases
container.registerSingleton("GetJobPostings", GetJobPostings);
container.registerSingleton("GetJobPostingById", GetJobPostingById);
container.registerSingleton("UpdateJobPosting", UpdateJobPosting);
container.registerSingleton("CreateJobPosting", CreateJobPosting);
container.registerSingleton("DeleteJobPosting", DeleteJobPosting);
container.registerSingleton("DisableJobPosting", DisableJobPosting);
container.registerSingleton("GetJobApplicants", GetJobApplicants);

//Register Job applications use cases
container.registerSingleton("ApplyJob", ApplyJob);
container.registerSingleton("RejectApplicant", RejectApplicant);

//Register service offer use cases
container.registerSingleton("GetServices", GetServices)
container.registerSingleton("GetServiceById", GetServiceById)
container.registerSingleton("CreateService", CreateService)
container.registerSingleton("UpdateService", UpdateService)
container.registerSingleton("DeleteService", DeleteService)
container.registerSingleton("SwitchStatus", SwitchStatus)
