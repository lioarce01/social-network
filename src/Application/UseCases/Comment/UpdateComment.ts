import { CommentRepository } from "../../../Domain/Repositories/CommentRepository";
import { Comment } from "../../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateComment {
  constructor(
    @inject("CommentRepository") private commentRepository: CommentRepository,
  ) {}

  async execute(
    userId: string,
    commentId: string,
    commentData: Partial<Comment>,
  ): Promise<{ message: string; comment: Comment }> {
    const { message, comment } = await this.commentRepository.updateComment(
      userId,
      commentId,
      commentData,
    );

    return { message, comment };
  }
}
