import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";
import {
  PostFilter,
  PostSortOptions,
} from "../../../Infrastructure/Filters/PostFilter";
import { CacheRepository } from "../../../Domain/Repositories/CacheRepository";

@injectable()
export class GetAllPosts {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
    @inject("CacheRepository")
    private readonly cacheRepository: CacheRepository,
  ) {}

  async execute(
    sortOptions: PostSortOptions = {
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    offset?: number,
    limit?: number,
  ): Promise<{ posts: Post[]; totalCount: number }> {
    const cacheKey = `posts:offset=${offset}&limit=${limit}&sort=${sortOptions.sortBy}&order=${sortOptions.sortOrder}`;
    const cachedPosts = await this.cacheRepository.get(cacheKey);

    // first ask if we have cached posts
    if (cachedPosts) {
      console.log("Cache hit for key:", cacheKey);
      return JSON.parse(cachedPosts);
    }

    console.log("Cache miss for key:", cacheKey);
    const filter = new PostFilter(sortOptions);
    const result = await this.postRepository.getAllPosts(filter, offset, limit);

    // cache the result for 30min
    await this.cacheRepository.set(cacheKey, JSON.stringify(result), 1800);

    console.log("Data cached for key:", cacheKey);
    return result;
  }
}
