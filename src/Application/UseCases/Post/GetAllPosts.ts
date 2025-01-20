import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";
import {
  PostFilter,
  PostSortOptions,
} from "../../../Infrastructure/Filters/PostFilter";

@injectable()
export class GetAllPosts {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {}

  async execute(
    sortOptions?: PostSortOptions,
    offset?: number,
    limit?: number,
  ): Promise<{ posts: Post[]; totalCount: number }> {
    const filter = new PostFilter(sortOptions);
    const result = await this.postRepository.getAllPosts(filter, offset, limit);
    return result;
  }
}
