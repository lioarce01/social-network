import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { GetAllPosts } from "../../../Application/UseCases/Post/GetAllPosts";
import { GetPostById } from "../../../Application/UseCases/Post/GetPostById";
import { GetUserPosts } from "../../../Application/UseCases/Post/getUserPosts";
import { CreatePost } from "../../../Application/UseCases/Post/CreatePost";
import { UpdatePost } from "../../../Application/UseCases/Post/UpdatePost";
import { DeletePost } from "../../../Application/UseCases/Post/DeletePost";

@injectable()
export class PostController {
  constructor(
    @inject("GetAllPosts") private getAllPostsUseCase: GetAllPosts,
    @inject("GetPostById") private getPostByIdUseCase: GetPostById,
    @inject("GetUserPosts") private getUserPostsUseCase: GetUserPosts,
    @inject("CreatePost") private createPostUseCase: CreatePost,
    @inject("UpdatePost") private updatePostUseCase: UpdatePost,
    @inject("DeletePost") private deletePostUseCase: DeletePost,
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

      const { message, post } = await this.createPostUseCase.execute(
        userId,
        content,
      );
      res.status(201).json({ message, post });
    } catch (e) {
      next(e);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
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
      const { id, content } = req.body;
      const { message, post } = await this.updatePostUseCase.execute(
        id,
        content,
      );

      res.status(200).json({ message, post });
    } catch (e) {
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
}