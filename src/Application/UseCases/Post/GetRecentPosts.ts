import { inject, injectable } from "tsyringe";
import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";

@injectable()
export class GetRecentPosts {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {}

  async execute(
    lastPostDate: Date,
    limit: number = 10,
  ): Promise<{ posts: Post[]; totalCount: number }> {
    return await this.postRepository.getRecentPosts(lastPostDate, limit);
  }
}
