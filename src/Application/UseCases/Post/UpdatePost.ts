import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";

@injectable()
export class UpdatePost {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
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
    return { message, post };
  }
}
