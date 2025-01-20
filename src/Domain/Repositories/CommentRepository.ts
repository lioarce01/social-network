import { Prisma } from "@prisma/client";
import { Comment } from "../Entities/Comment";
import { CommentFilter } from "../../Infrastructure/Filters/CommentFilter";

export interface CommentRepository {
  getAllComments(offset?: number, limit?: number): Promise<Comment[] | null>;
  getPostComments(
    id: string,
    filter?: CommentFilter,
  ): Promise<{ comments: Comment[]; totalCount: number }>;
  getUserComments(id: string): Promise<Comment[] | null>;
  createComment(
    userId: string,
    postId: string,
    commentData: Prisma.CommentCreateInput,
  ): Promise<{ message: string; comment: Comment }>;
  deleteComment(id: string): Promise<{ message: string }>;
  updateComment(
    userId: string,
    commentId: string,
    commentData: Partial<Comment>,
  ): Promise<{ message: string; comment: Comment }>;
}
