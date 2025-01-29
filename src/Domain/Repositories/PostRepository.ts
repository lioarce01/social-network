import { Prisma } from "@prisma/client";
import { Post } from "../Entities/Post";
import { PostFilter } from "../../Infrastructure/Filters/PostFilter";

export interface PostRepository {
  getAllPosts(
    filter?: PostFilter,
    offset?: number,
    limit?: number,
  ): Promise<{ posts: Post[]; totalCount: number }>;
  getPostById(id: string): Promise<Post | null>;
  getUserPosts(id: string): Promise<Post[] | null>;
  createPost(
    id: string,
    postData: Prisma.PostCreateInput,
  ): Promise<{ message: string; post: Post }>;
  deletePost(id: string, ownerId: string): Promise<{ message: string }>;
  updatePost(
    userId: string,
    postId: string,
    postData: Partial<Post>,
  ): Promise<{ message: string; post: Post }>;
}
