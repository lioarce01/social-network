import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { inject, injectable } from "tsyringe";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class DeletePost {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
    @inject("CacheService") private readonly cacheService: CacheService,
  ) {}

  async execute(id: string, ownerId: string): Promise<{ message: string }> {
    if (!id || !ownerId) {
      throw new Error("Post ID and User ID are required");
    }

    const { message } = await this.postRepository.deletePost(id, ownerId);

    await this.cacheService.invalidateKeys("posts:*");

    return { message };
  }
}
