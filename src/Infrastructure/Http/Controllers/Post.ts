import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { GetAllPosts } from "../../../Application/UseCases/Post/GetAllPosts";
import { GetPostById } from "../../../Application/UseCases/Post/GetPostById";
import { GetUserPosts } from "../../../Application/UseCases/Post/getUserPosts";
import { CreatePost } from "../../../Application/UseCases/Post/CreatePost";
import { UpdatePost } from "../../../Application/UseCases/Post/UpdatePost";
import { DeletePost } from "../../../Application/UseCases/Post/DeletePost";
import { LikePost } from "../../../Application/UseCases/PostLike/Like";
import { Prisma } from "@prisma/client";
import { UnlikePost } from "../../../Application/UseCases/PostLike/Unlike";

@injectable()
export class PostController
{
  constructor(
    @inject("GetAllPosts") private getAllPostsUseCase: GetAllPosts,
    @inject("GetPostById") private getPostByIdUseCase: GetPostById,
    @inject("GetUserPosts") private getUserPostsUseCase: GetUserPosts,
    @inject("CreatePost") private createPostUseCase: CreatePost,
    @inject("UpdatePost") private updatePostUseCase: UpdatePost,
    @inject("DeletePost") private deletePostUseCase: DeletePost,
    @inject("LikePost") private likePostUseCase: LikePost,
    @inject("UnlikePost") private unlikePostUseCase: UnlikePost,
  ) { }


  async getAllPosts(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { sortBy, sortOrder } = req.query;
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;

      const sortOptions = {
        sortBy: sortBy as "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
      };

      const { posts, totalCount } = await this.getAllPostsUseCase.execute(
        sortOptions,
        offset,
        limit,
      );

      return res.status(200).json({
        posts,
        totalCount,
      });
    } catch (e) {
      next(e);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { content } = req.body;
      const userId = req.auth!.sub;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const postData: Prisma.PostCreateInput = {
        content,
        author: {
          connect: { sub: userId },
        },
      };

      const { message, post } = await this.createPostUseCase.execute(
        userId!,
        postData,
      );

      return res.status(201).json({
        code: 201,
        message,
        post,
      });
    } catch (e) {
      next(e);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { id } = req.params;
      const post = await this.getPostByIdUseCase.execute(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.status(200).json(post);
    } catch (e) {
      next(e);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { id, content } = req.body;
      const userId = req.auth!.sub.split("|")[1];

      if (!id) {
        return res.status(400).json({
          code: 400,
          error: "BAD_REQUEST",
          message: "Post ID is required",
        });
      }

      const { message, post } = await this.updatePostUseCase.execute(
        id,
        userId!,
        {
          content,
        },
      );

      return res.status(200).json({
        code: 200,
        message: message,
        post: post,
      });
    } catch (e) {
      next(e);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { id } = req.body;
      const userId = req.auth!.sub.split("|")[1];

      if (!id) {
        return res.status(400).json({
          code: 400,
          error: "BAD_REQUEST",
          message: "Post ID is required in request body",
        });
      }

      const { message } = await this.deletePostUseCase.execute(id, userId!);

      return res.status(200).json({
        code: 200,
        status: "SUCCESS",
        message: message,
      });
    } catch (e) {
      next(e);
    }
  }

  async getUserPosts(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { id } = req.body;
      const posts = await this.getUserPostsUseCase.execute(id);

      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: "No posts found" });
      }

      return res.status(200).json(posts);
    } catch (e) {
      next(e);
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { postId } = req.body;
      const userId = req.auth!.sub

      if (!userId) {
        return res.status(400).json({
          code: 400,
          error: "BAD_REQUEST",
          message: "User ID is missing in authentication token",
        });
      }

      const { message, postLike } = await this.likePostUseCase.execute(
        userId!,
        postId,
      );

      return res.status(201).json({
        code: 201,
        status: "SUCCESS",
        message: message,
        postLike: postLike,
      });
    } catch (e) {
      next(e);
    }
  }

  async unlikePost(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { postId } = req.body;
      const userId = req.auth!.sub

      if (!userId) {
        return res.status(400).json({
          code: 400,
          error: "BAD_REQUEST",
          message: "User ID is missing in authentication token",
        });
      }

      const { message } = await this.unlikePostUseCase.execute(userId!, postId);

      return res.status(200).json({
        code: 200,
        status: "SUCCESS",
        message: message,
      });
    } catch (e) {
      next(e);
    }
  }
}
