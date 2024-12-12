import { Prisma, Post } from "@prisma/client";

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
    postData: Prisma.PostUpdateInput,
  ): Promise<{ message: string; post: Post }>;
}
