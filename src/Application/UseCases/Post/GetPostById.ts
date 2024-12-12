import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetPostById {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {}

  async execute(id: string): Promise<Post | null> {
    const post = await this.postRepository.getPostById(id);

    return post;
  }
}
