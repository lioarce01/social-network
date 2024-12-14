import { CommentRepository } from "../../Domain/Repositories/CommentRepository";
import { Comment } from "../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { prisma } from "../../config/config";

@injectable()
export class PrismaCommentRepository implements CommentRepository {
  async getAllComments(
    offset?: number,
    limit?: number,
  ): Promise<Comment[] | null> {
    const comments = await prisma.comment.findMany({
      ...(typeof offset !== "undefined" && { skip: offset }),
      ...(typeof limit !== "undefined" && { take: limit }),
    });

    return comments;
  }

  async getPostComments(id: string): Promise<Comment[] | null> {
    const commentsPost = await prisma.comment.findMany({
      where: {
        postId: id,
      },
    });

    return commentsPost;
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

    const postExist = await prisma.post.findUnique({ where: { id: postId } });

    if (!postExist) {
      throw new Error("Post not found");
    }

    const userExist = await prisma.user.findUnique({ where: { id: userId } });

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
    const commentExist = await prisma.comment.findUnique({ where: { id } });

    if (!commentExist) {
      return { message: "Comment not found" };
    }

    await prisma.comment.delete({ where: { id } });
    return { message: "Comment deleted successfully" };
  }

  async updateComment(
    id: string,
    commentData: { content: string },
  ): Promise<{ message: string; comment: Comment }> {
    const updatedComment = await prisma.comment.update({
      where: { id },
      include: {
        author: true,
      },
      data: {
        ...commentData,
        updatedAt: new Date(),
      },
    });

    return {
      message: "Comment updated successfully",
      comment: updatedComment,
    };
  }
}
