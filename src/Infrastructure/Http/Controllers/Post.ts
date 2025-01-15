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
export class PostController {
  constructor(
    @inject("GetAllPosts") private getAllPostsUseCase: GetAllPosts,
    @inject("GetPostById") private getPostByIdUseCase: GetPostById,
    @inject("GetUserPosts") private getUserPostsUseCase: GetUserPosts,
    @inject("CreatePost") private createPostUseCase: CreatePost,
    @inject("UpdatePost") private updatePostUseCase: UpdatePost,
    @inject("DeletePost") private deletePostUseCase: DeletePost,
    @inject("LikePost") private likePostUseCase: LikePost,
    @inject("UnlikePost") private unlikePostUseCase: UnlikePost,
  ) {}

  async getAllPosts(req: Request, res: Response, next: NextFunction) {
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

      const posts = await this.getAllPostsUseCase.execute(
        parsedOffset,
        parsedLimit,
      );

      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: "No posts found" });
      }

      res.status(200).json(posts);
    } catch (e) {
      next(e);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const postData: Prisma.PostCreateInput = {
        content,
        author: {
          connect: { id: userId },
        },
      };

      const { message, post } = await this.createPostUseCase.execute(
        userId,
        postData,
      );
      res.status(201).json({ message, post });
    } catch (e) {
      next(e);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await this.getPostByIdUseCase.execute(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (e) {
      next(e);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, postId, content } = req.body;
      const { message, post } = await this.updatePostUseCase.execute(
        userId,
        postId,
        {
          content,
        },
      );

      res.status(200).json({ message, post });
    } catch (e) {
      if (
        e instanceof Error &&
        e.message === "You are not the author of this post"
      ) {
        return res
          .status(403)
          .json({ message: "You are not the author of this post" });
      }
      next(e);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const { message } = await this.deletePostUseCase.execute(id);

      res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const posts = await this.getUserPostsUseCase.execute(id);

      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: "No posts found" });
      }

      res.status(200).json(posts);
    } catch (e) {
      next(e);
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, postId } = req.body;

      const { message, postLike } = await this.likePostUseCase.execute(
        userId,
        postId,
      );

      res.status(201).json({ message, postLike });
    } catch (e) {
      next(e);
    }
  }

  async unlikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, postId } = req.body;

      const { message } = await this.unlikePostUseCase.execute(userId, postId);

      res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }
}
