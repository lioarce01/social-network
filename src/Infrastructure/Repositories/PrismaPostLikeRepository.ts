import { PostLikeRepository } from "../../Domain/Repositories/PostLikeRepository";
import { PostLike } from "../../Domain/Entities/PostLike";
import { injectable } from "tsyringe";
import { BasePrismaRepository } from "./BasePrismaRepository";
import { CustomError } from "../../Shared/CustomError";

@injectable()
export class PrismaPostLikeRepository
  extends BasePrismaRepository<PostLike>
  implements PostLikeRepository
{
  protected entityName = "postLike";

  async likePost(
    userId: string,
    postId: string,
  ): Promise<{ message: string; postLike: PostLike }> {
    const user = await this.prisma.user.findUnique({ where: { sub: userId } });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const existingLike = await this.getExistingLike(user.id, postId);

    if (existingLike) {
      throw new CustomError("User already liked this post", 400);
    }

    const postLike = await this.runTransaction(async (tx) => {
      const postLike = await tx.postLike.create({
        data: {
          userId: user.id,
          postId,
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
      return postLike;
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
    const user = await this.prisma.user.findUnique({ where: { sub: userId } });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const existingLike = await this.getExistingLike(user.id, postId);

    if (!existingLike) {
      throw new CustomError("User has not liked this post", 404);
    }

    await this.runTransaction(async (tx) => {
      await tx.postLike.delete({
        where: {
          userId_postId: { userId: user?.id, postId },
        },
      }),
        await tx.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        });
    });

    return { message: "Post unliked successfully" };
  }

  //HELPER METHODS
  private async getExistingLike(userId: string, postId: string) {
    return await this.prisma.postLike.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }
}
