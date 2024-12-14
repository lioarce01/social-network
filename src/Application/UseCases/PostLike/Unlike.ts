import { PostLikeRepository } from "../../../Domain/Repositories/PostLikeRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class UnlikePost {
  constructor(
    @inject("PostLikeRepository")
    private readonly postLikeRepository: PostLikeRepository,
  ) {}

  async execute(userId: string, postId: string): Promise<{ message: string }> {
    const { message } = await this.postLikeRepository.unlikePost(
      userId,
      postId,
    );

    return { message };
  }
}
