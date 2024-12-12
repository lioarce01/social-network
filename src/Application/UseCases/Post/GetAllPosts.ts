import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetAllPosts {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {}

  async execute(offset?: number, limit?: number): Promise<Post[] | null> {
    const posts = await this.postRepository.getAllPosts(offset, limit);
    return posts;
  }
}
