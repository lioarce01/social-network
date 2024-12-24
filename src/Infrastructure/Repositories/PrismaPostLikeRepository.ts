import { PostLikeRepository } from "../../Domain/Repositories/PostLikeRepository";
import { PostLike } from "../../Domain/Entities/PostLike";
import { injectable } from "tsyringe";
import { prisma } from "../../config/config";

@injectable()
export class PrismaPostLikeRepository implements PostLikeRepository {
  async likePost(
    userId: string,
    postId: string,
  ): Promise<{ message: string; postLike: PostLike }> {
    const existingLike = await this.getExistingLike(userId, postId);

    if (existingLike) {
      return {
        message: "User already liked this post",
        postLike: existingLike,
      };
    }

    const postLike = await prisma.postLike.create({
      data: {
        userId,
        postId,
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });

    return {
      message: "Post liked successfully",
      postLike,
    };
  }

  async unlikePost(
    userId: string,
    postId: string,
  ): Promise<{ message: string }> {
    const existingLike = await this.getExistingLike(userId, postId);

    if (!existingLike) {
      return { message: "Like not found" };
    }

    await prisma.$transaction([
      prisma.postLike.delete({
        where: {
          userId_postId: { userId, postId },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    return { message: "Post unliked successfully" };
  }

  //HELPER METHODS
  private async getExistingLike(userId: string, postId: string) {
    return await prisma.postLike.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }
}
