import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { Post } from "../../../Domain/Entities/Post";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";

@injectable()
export class CreatePost {
  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {}

  async execute(
    id: string,
    postData: Prisma.PostCreateInput,
  ): Promise<{ message: string; post: Post }> {
    const { message, post } = await this.postRepository.createPost(
      id,
      postData,
    );

    return { message, post };
  }
}
