import { PostRepository } from "../../Domain/Repositories/PostRepository";
import { Post } from "../../Domain/Entities/Post";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { User } from "../../Domain/Entities/User";

@injectable()
export class PrismaPostRepository implements PostRepository {
  async getPostById(id: string): Promise<Post | null> {
    return await prisma.post.findUnique({
      where: { id },
      include: { author: true, comments: true },
    });
  }

  async getUserPosts(id: string): Promise<Post[] | null> {
    return await prisma.post.findMany({
      where: { id },
      include: { author: true, comments: true },
    });
  }

  async createPost(
    id: string,
    postData: Prisma.PostCreateInput,
  ): Promise<{ message: string; post: Post }> {
    const createdPost = await prisma.post.create({
      data: {
        ...postData,
        id: id,
      },
      include: {
        author: true,
        comments: true,
      },
    });

    const postEntity = new Post(
      createdPost.id,
      createdPost.content,
      createdPost.authorId,
      createdPost.author as User,
      createdPost.comments,
      createdPost.createdAt,
      createdPost.updatedAt,
    );

    return { message: "Post created successfully", post: postEntity };
  }

  async deletePost(id: string): Promise<{ message: string }> {
    await prisma.post.delete({ where: { id } });
    return { message: "Post deleted successfully" };
  }

  async updatePost(
    id: string,
    postData: { content: string },
  ): Promise<{ message: string; post: Post }> {
    const updatedPost = await prisma.post.update({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
      data: postData,
    });

    return {
      message: "Post updated successfully",
      post: updatedPost,
    };
  }

  async getAllPosts(offset?: number, limit?: number): Promise<Post[] | null> {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
      ...(typeof offset !== "undefined" && { skip: offset }),
      ...(typeof limit !== "undefined" && { take: limit }),
    });

    return posts;
  }
}
