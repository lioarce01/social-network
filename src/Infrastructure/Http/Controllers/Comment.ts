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
export class CommentController
{
  constructor(
    @inject("GetAllComments") private getAllCommentsUseCase: GetAllComments,
    @inject("GetUserComments") private getUserCommentsUseCase: GetUserComments,
    @inject("GetPostComments") private getPostCommentsUseCase: GetPostComments,
    @inject("CreateComment") private createCommentUseCase: CreateComment,
    @inject("UpdateComment") private updateCommentUseCase: UpdateComment,
    @inject("DeleteComment") private deleteCommentUseCase: DeleteComment,
  ) { }

  namespace = 'https://socialnetwork.com/'


  async getAllComments(req: Request, res: Response, next: NextFunction)
  {
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

  async getUserComments(req: Request, res: Response, next: NextFunction)
  {
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

  async getPostComments(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { id } = req.params;
      const { sortBy, sortOrder, offset, limit } = req.query;

      const sortOptions = {
        sortBy: sortBy as "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
      };

      const parsedOffset =
        typeof offset === "string" && offset.trim() !== ""
          ? Number(offset)
          : undefined;
      const parsedLimit =
        typeof limit === "string" && limit.trim() !== ""
          ? Number(limit)
          : undefined;

      const { comments, totalCount } =
        await this.getPostCommentsUseCase.execute(
          id,
          sortOptions,
          parsedOffset,
          parsedLimit,
        );

      res.status(200).json({ comments, totalCount });
    } catch (e) {
      next(e);
    }
  }

  async createComment(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { postId, content } = req.body;
      const userId = req.auth![`${this.namespace}sub`]

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const commentData: Prisma.CommentCreateInput = {
        content,
        post: { connect: { id: postId } },
        author: { connect: { sub: userId } },
      };

      const { message, comment } = await this.createCommentUseCase.execute(
        userId,
        postId,
        commentData,
      );

      res.status(201).json({
        code: 201,
        status: "SUCCESS",
        message,
        comment
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { id } = req.body;

      const userId = req.auth![`${this.namespace}sub`]

      const { message } = await this.deleteCommentUseCase.execute(id, userId!);

      res.status(200).json({
        code: 200,
        status: "SUCCESS",
        message,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateComment(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { commentId, content } = req.body;

      const userId = req.auth![`${this.namespace}sub`]

      const { message, comment } = await this.updateCommentUseCase.execute(
        userId,
        commentId,
        {
          content,
        },
      );

      res.status(200).json({
        code: 200,
        status: "SUCCESS",
        message,
        comment
      });
    } catch (e) {
      next(e);
    }
  }
}
