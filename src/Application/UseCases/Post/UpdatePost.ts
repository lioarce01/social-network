import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class UpdatePost {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
    @inject("CacheService") private readonly cacheService: CacheService,
  ) {}

  async execute(
    userId: string,
    postId: string,
    postData: Partial<Post>,
  ): Promise<{ message: string; post: Post }> {
    const { message, post } = await this.postRepository.updatePost(
      userId,
      postId,
      postData,
    );

    await this.cacheService.invalidateKeys("posts:*");

    return { message, post };
  }
}
