import { CommentRepository } from "../../../Domain/Repositories/CommentRepository";
import { Comment } from "../../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";

@injectable()
export class CreateComment {
  constructor(
    @inject("CommentRepository")
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(
    id: string,
    commentData: Prisma.CommentCreateInput,
  ): Promise<{ message: string; comment: Comment }> {
    const { message, comment } = await this.commentRepository.createComment(
      id,
      commentData,
    );

    return {
      message,
      comment,
    };
  }
}
