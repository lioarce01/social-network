import { PostLike } from "../../../Domain/Entities/PostLike";
import { PostLikeRepository } from "../../../Domain/Repositories/PostLikeRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class LikePost {
  constructor(
    @inject("PostLikeRepository")
    private readonly postLikeRepository: PostLikeRepository,
  ) {}

  async execute(
    userId: string,
    postId: string,
  ): Promise<{ message: string; postLike: PostLike }> {
    const { message, postLike } = await this.postLikeRepository.likePost(
      userId,
      postId,
    );

    return { message, postLike };
  }
}
