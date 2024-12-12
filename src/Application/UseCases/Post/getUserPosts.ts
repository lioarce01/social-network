import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserPosts {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {}

  async execute(id: string): Promise<Post[] | null> {
    const posts = await this.postRepository.getUserPosts(id);

    return posts;
  }
}
