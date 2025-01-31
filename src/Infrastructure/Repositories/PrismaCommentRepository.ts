import { CommentRepository } from "../../Domain/Repositories/CommentRepository";
import { Comment } from "../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { prisma } from "../../config/config";
import { CommentFilter } from "../Filters/CommentFilter";

@injectable()
export class PrismaCommentRepository implements CommentRepository {
  async getAllComments(
    offset?: number,
    limit?: number,
  ): Promise<Comment[] | null> {
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
  }> {
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

  async getUserComments(id: string): Promise<Comment[] | null> {
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
  ): Promise<{ message: string; comment: Comment }> {
    if (!commentData.content) {
      throw new Error("Content is required");
    }

    const postExist = await this.getPostById(postId);

    if (!postExist) {
      throw new Error("Post not found");
    }

    const userExist = await this.getUserById(userId);

    if (!userExist) {
      throw new Error("User not found");
    }

    const createdComment = await prisma.comment.create({
      data: {
        content: commentData.content,
        post: {
          connect: { id: postId },
        },
        author: {
          connect: { id: userId },
        },
      },
      include: {
        author: true,
      },
    });

    return { message: "Comment created successfully", comment: createdComment };
  }

  async deleteComment(id: string): Promise<{ message: string }> {
    const commentExist = await this.getCommentById(id);

    if (!commentExist) {
      return { message: "Comment not found" };
    }

    await prisma.comment.delete({ where: { id } });
    return { message: "Comment deleted successfully" };
  }

  async updateComment(
    userId: string,
    commentId: string,
    commentData: { content: string },
  ): Promise<{ message: string; comment: Comment }> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.authorId !== userId) {
      throw new Error("User does not have permission to update this comment");
    }

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

  //HELPER METHODS
  private async getCommentById(id: string) {
    return await prisma.comment.findUnique({ where: { id } });
  }

  private async getUserById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  private async getPostById(id: string) {
    return await prisma.post.findUnique({ where: { id } });
  }
}
