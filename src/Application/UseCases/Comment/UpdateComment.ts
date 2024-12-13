import { CommentRepository } from "../../../Domain/Repositories/CommentRepository";
import { Comment } from "../../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";

@injectable()
export class updateComment {
  constructor(
    @inject("CommentRepository") private commentRepository: CommentRepository,
  ) {}

  async execute(
    id: string,
    commentData: Partial<Comment>,
  ): Promise<{ message: string; comment: Comment }> {
    const { message, comment } = await this.commentRepository.updateComment(
      id,
      commentData,
    );

    return { message, comment };
  }
}
