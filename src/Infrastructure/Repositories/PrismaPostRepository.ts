import { PostRepository } from "../../Domain/Repositories/PostRepository";
import { Post } from "../../Domain/Entities/Post";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { PostFilter } from "../Filters/PostFilter";

@injectable()
export class PrismaPostRepository implements PostRepository {
  async getPostById(id: string): Promise<Post | null> {
    return await prisma.post.findUnique({
      where: { id },
      include: { author: true, comments: true, likes: true },
    });
  }

  async getUserPosts(id: string): Promise<Post[] | null> {
    return await prisma.post.findMany({
      where: { id },
    });
  }

  async createPost(
    userId: string,
    postData: Prisma.PostCreateInput,
  ): Promise<{ message: string; post: Post }> {
    if (!postData.content) {
      throw new Error("Content is required");
    }

    const userExist = await this.getUserById(userId);

    if (!userExist) {
      throw new Error("User does not exist");
    }

    const createdPost = await prisma.post.create({
      data: {
        content: postData.content,
        author: {
          connect: { id: userId },
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
    userId: string,
    postId: string,
    postData: { content: string },
  ): Promise<{ message: string; post: Post }> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (!post) {
      throw new Error("Post does not exist");
    }

    if (post.author.id !== userId) {
      throw new Error("You are not the author of this post");
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
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

  async getAllPosts(
    filter?: PostFilter,
    offset?: number,
    limit?: number,
  ): Promise<Post[] | null> {
    const orderByClause = filter?.buildOrderByClause();
    const posts = await prisma.post.findMany({
      where: {},
      orderBy: orderByClause,
      include: {
        author: true,
      },
      ...(offset && { skip: offset }),
      ...(limit && { take: limit }),
    });

    return posts;
  }

  //HELPER METHODS
  private async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}
