import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeletePost {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const { message } = await this.postRepository.deletePost(id);

    return { message };
  }
}
