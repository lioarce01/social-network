import { PostLike } from "../../../Domain/Entities/PostLike";
import { PostLikeRepository } from "../../../Domain/Repositories/PostLikeRepository";
import { inject, injectable } from "tsyringe";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class LikePost
{
  constructor(
    @inject("PostLikeRepository")
    private readonly postLikeRepository: PostLikeRepository,
    @inject("CacheService") private readonly cacheService: CacheService,
  ) { }

  async execute(
    userId: string,
    postId: string,
  ): Promise<{ message: string; postLike: PostLike }>
  {
    const { message, postLike } = await this.postLikeRepository.likePost(
      userId,
      postId,
    );

    await this.cacheService.invalidateKeys("posts:*")

    return { message, postLike };
  }
}
