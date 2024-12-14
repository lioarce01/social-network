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
    });
  }

  async createPost(
    id: string,
    postData: Prisma.PostCreateInput,
  ): Promise<{ message: string; post: Post }> {
    if (!postData.content) {
      throw new Error("Content is required");
    }

    const userExist = await prisma.user.findUnique({ where: { id } });

    if (!userExist) {
      throw new Error("User does not exist");
    }

    const createdPost = await prisma.post.create({
      data: {
        content: postData.content,
        author: {
          connect: { id: postData.author.connect?.id },
        },
      },
      include: {
        author: true,
        comments: true,
      },
    });

    return { message: "Post created successfully", post: createdPost };
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
      data: {
        ...postData,
        updatedAt: new Date(),
      },
    });

    return {
      message: "Post updated successfully",
      post: updatedPost,
    };
  }

  async getAllPosts(offset?: number, limit?: number): Promise<Post[] | null> {
    const posts = await prisma.post.findMany({
      ...(typeof offset !== "undefined" && { skip: offset }),
      ...(typeof limit !== "undefined" && { take: limit }),
    });

    return posts;
  }
}
