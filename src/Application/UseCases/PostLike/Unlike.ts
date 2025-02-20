import { PostLikeRepository } from "../../../Domain/Repositories/PostLikeRepository";
import { inject, injectable } from "tsyringe";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class UnlikePost
{
  constructor(
    @inject("PostLikeRepository")
    private readonly postLikeRepository: PostLikeRepository,
    @inject("CacheService") private readonly cacheService: CacheService,

  ) { }

  async execute(userId: string, postId: string): Promise<{ message: string }>
  {
    const { message } = await this.postLikeRepository.unlikePost(
      userId,
      postId,
    );

    await this.cacheService.invalidateKeys("posts:*");

    return { message };
  }
}
