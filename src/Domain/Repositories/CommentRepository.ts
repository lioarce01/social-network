import { Prisma } from "@prisma/client";
import { Comment } from "../Entities/Comment";

export interface CommentRepository {
  getAllComments(offset?: number, limit?: number): Promise<Comment[] | null>;
  getPostComments(id: string): Promise<Comment[] | null>;
  getUserComments(id: string): Promise<Comment[] | null>;
  createComment(
    id: string,
    commentData: Prisma.CommentCreateInput,
  ): Promise<{ message: string; comment: Comment }>;
  deleteComment(id: string): Promise<{ message: string }>;
  updateComment(
    id: string,
    commentData: Prisma.CommentUpdateInput,
  ): Promise<{ message: string; comment: Comment }>;
}