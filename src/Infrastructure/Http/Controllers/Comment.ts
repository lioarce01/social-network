import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { GetAllComments } from "../../../Application/UseCases/Comment/GetAllComments";
import { GetUserComments } from "../../../Application/UseCases/Comment/GetUserComments";
import { GetPostComments } from "../../../Application/UseCases/Comment/GetPostComments";
import { CreateComment } from "../../../Application/UseCases/Comment/CreateComment";
import { UpdateComment } from "../../../Application/UseCases/Comment/UpdateComment";
import { DeleteComment } from "../../../Application/UseCases/Comment/DeleteComment";

@injectable()
export class CommentController {
  constructor(
    @inject("GetAllComments") private getAllCommentsUseCase: GetAllComments,
    @inject("GetUserComments") private getUserCommentsUseCase: GetUserComments,
    @inject("GetPostComments") private getPostCommentsUseCase: GetPostComments,
    @inject("CreateComment") private createCommentUseCase: CreateComment,
    @inject("UpdateComment") private updateCommentUseCase: UpdateComment,
    @inject("DeleteComment") private deleteCommentUseCase: DeleteComment,
  ) {}

  async getAllComments(req: Request, res: Response, next: NextFunction) {
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

      const comments = await this.getAllCommentsUseCase.execute(
        parsedOffset,
        parsedLimit,
      );

      if (!comments || comments.length === 0) {
        return res.status(404).json({ message: "No comments found" });
      }

      res.status(200).json(comments);
    } catch (e) {
      next(e);
    }
  }

  async getUserComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const comments = await this.getUserCommentsUseCase.execute(id);

      if (!comments || comments.length === 0) {
        return res.status(404).json({ message: "No comments found" });
      }

      res.status(200).json(comments);
    } catch (e) {
      next(e);
    }
  }

  async getPostComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const comments = await this.getPostCommentsUseCase.execute(id);

      if (!comments || comments.length === 0) {
        return res.status(404).json({ message: "No comments found" });
      }
      res.status(200).json(comments);
    } catch (e) {
      next(e);
    }
  }

  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, postId, content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const commentData: Prisma.CommentCreateInput = {
        content,
        post: {
          connect: { id: postId },
        },
        author: {
          connect: { id: userId },
        },
      };

      const { message, comment } = await this.createCommentUseCase.execute(
        userId,
        postId,
        commentData,
      );

      res.status(201).json({ message, comment });
    } catch (e) {
      next(e);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const { message } = await this.deleteCommentUseCase.execute(id);

      res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, content } = req.body;

      const { message, comment } = await this.updateCommentUseCase.execute(id, {
        content,
      });

      res.status(200).json({ message, comment });
    } catch (e) {
      next(e);
    }
  }
}
