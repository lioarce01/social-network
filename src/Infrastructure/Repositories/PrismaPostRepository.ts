import { PostRepository } from "../../Domain/Repositories/PostRepository";
import { Post } from "../../Domain/Entities/Post";
import { injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { PostFilter } from "../Filters/PostFilter";
import { BasePrismaRepository } from "./BasePrismaRepository";
import { CustomError } from "../../Shared/CustomError";

@injectable()
export class PrismaPostRepository
  extends BasePrismaRepository<Post>
  implements PostRepository
{
  protected entityName = "post";

  async getPostById(id: string): Promise<Post | null> {
    return await this.prisma.post.findUnique({
      where: { id },
      include: { author: true, comments: true, likes: true },
    });
  }

  async getUserPosts(id: string): Promise<Post[] | null> {
    return await this.prisma.post.findMany({
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

    const user = await this.prisma.user.findUnique({ where: { sub: userId } });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const createdPost = await this.prisma.post.create({
      data: {
        content: postData.content,
        author: {
          connect: { sub: userId },
        },
      },
      include: {
        author: true,
        comments: true,
      },
    });

    return { message: "Post created successfully", post: createdPost };
  }

  async deletePost(id: string, ownerId: string): Promise<{ message: string }> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new CustomError("Post does not exist", 404);
    }

    if (ownerId !== post?.author?.sub?.split("|")[1]) {
      throw new CustomError("You are not the owner of this post", 403);
    }

    this.baseDelete(id);

    return { message: "Post deleted successfully" };
  }

  async updatePost(
    postId: string,
    userId: string,
    postData: { content: string },
  ): Promise<{ message: string; post: Post }> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new CustomError("Post does not exist", 404);
    }

    if (userId !== post?.author?.sub?.split("|")[1]) {
      throw new CustomError("You are not the owner of this post", 403);
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        content: postData.content,
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
    offset: number = 0,
    limit: number = 10,
  ): Promise<{ posts: Post[]; totalCount: number }> {
    const orderByClause = filter?.buildOrderByClause();
    const posts = await this.prisma.post.findMany({
      where: {},
      orderBy: orderByClause,
      include: {
        author: true,
      },
      skip: offset,
      take: limit,
    });

    const totalCount = await this.prisma.post.count({
      where: {},
    });

    return { posts, totalCount };
  }
}
