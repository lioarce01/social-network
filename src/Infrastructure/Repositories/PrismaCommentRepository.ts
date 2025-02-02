import { CommentRepository } from "../../Domain/Repositories/CommentRepository";
import { Comment } from "../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { prisma } from "../../config/config";
import { CommentFilter } from "../Filters/CommentFilter";
import { BasePrismaRepository } from "./BasePrismaRepository";
import { CustomError } from "../../Shared/CustomError";

@injectable()
export class PrismaCommentRepository extends BasePrismaRepository<Comment> implements CommentRepository
{
  entityName = "Comment"
  async getAllComments(
    offset?: number,
    limit?: number,
  ): Promise<Comment[] | null>
  {
    const comments = await prisma.comment.findMany({
      ...(offset && { skip: offset }),
      ...(limit && { take: limit }),
    });

    return comments;
  }

  async getPostComments(
    id: string,
    filter?: CommentFilter,
    offset?: number,
    limit?: number,
  ): Promise<{
    comments: Comment[];
    totalCount: number;
  }>
  {
    const orderByClause = filter?.buildOrderByClause();
    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
      },
      orderBy: orderByClause,
      include: {
        author: true,
      },
      ...(offset !== undefined && { skip: offset }),
      ...(limit !== undefined && { take: limit }),
    });

    const totalCount = await prisma.comment.count({
      where: {
        postId: id,
      },
    });

    return { comments, totalCount };
  }

  async getUserComments(id: string): Promise<Comment[] | null>
  {
    const userComments = await prisma.comment.findMany({
      where: {
        authorId: id,
      },
    });

    return userComments;
  }

  async createComment(
    userId: string,
    postId: string,
    commentData: Prisma.CommentCreateInput,
  ): Promise<{ message: string; comment: Comment }>
  {
    if (!commentData.content) {
      throw new CustomError("Content is required", 400)
    }

    const post = await this.getPostById(postId);

    if (!post) {
      throw new CustomError("Post not found", 404);
    }

    const user = await this.prisma.user.findUnique({ where: { sub: userId } })

    const createdComment = await prisma.comment.create({
      data: {
        content: commentData.content,
        post: {
          connect: { id: postId },
        },
        author: {
          connect: { id: user?.id },
        },
      },
      include: {
        author: true,
      },
    });

    return { message: "Comment created successfully", comment: createdComment };
  }

  async deleteComment(id: string, userId: string): Promise<{ message: string }>
  {
    const user = await this.prisma.user.findUnique({ where: { sub: userId } })
    const comment = await this.getCommentById(id);

    if (!comment) {
      throw new CustomError("Comment not found", 404)
    }

    if (user?.id === comment.authorId || user?.role === "ADMIN") {
      await prisma.comment.delete({ where: { id } });
      return { message: "Comment deleted successfully" };
    }

    throw new CustomError("You are not authorized to delete this comment", 403)
  }

  async updateComment(
    userId: string,
    commentId: string,
    commentData: { content: string },
  ): Promise<{ message: string; comment: Comment }>
  {
    const user = await this.prisma.user.findUnique({ where: { sub: userId } })
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      throw new CustomError("Comment not found", 404);
    }

    if (user?.id === comment?.author?.id) {
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          ...commentData,
          updatedAt: new Date(),
        },
        include: {
          author: true,
        },
      });

      return {
        message: "Comment updated successfully",
        comment: updatedComment,
      };
    }

    throw new CustomError("You are not authorized to update this comment", 403)
  }

  //HELPER METHODS
  private async getCommentById(id: string)
  {
    return await prisma.comment.findUnique({ where: { id } });
  }

  private async getUserById(id: string)
  {
    return await prisma.user.findUnique({ where: { id } });
  }

  private async getPostById(id: string)
  {
    return await prisma.post.findUnique({ where: { id } });
  }
}
