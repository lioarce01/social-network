import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { inject, injectable } from "tsyringe";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class DeletePost {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
    @inject("CacheService") private readonly cacheService: CacheService,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const { message } = await this.postRepository.deletePost(id);

    await this.cacheService.invalidateKeys("posts:*");

    return { message };
  }
}
