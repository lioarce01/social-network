import { inject, injectable } from "tsyringe";
import { PostRepository } from "../../../Domain/Repositories/PostRepository";

@injectable()
export class CountRecentPosts {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {}

  async execute(lastPostId: string): Promise<number> {
    return await this.postRepository.countRecentPosts(lastPostId);
  }
}
