import { Prisma } from "@prisma/client";
import { Post } from "../Entities/Post";

export interface PostRepository {
  getAllPosts(offset?: number, limit?: number): Promise<Post[] | null>;
  getPostById(id: string): Promise<Post | null>;
  getUserPosts(id: string): Promise<Post[] | null>;
  createPost(
    id: string,
    postData: Prisma.PostCreateInput,
  ): Promise<{ message: string; post: Post }>;
  deletePost(id: string): Promise<{ message: string }>;
  updatePost(
    id: string,
    postData: Partial<Post>,
  ): Promise<{ message: string; post: Post }>;
}
