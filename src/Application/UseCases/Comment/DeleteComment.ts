import { CommentRepository } from "../../../Domain/Repositories/CommentRepository";
import { Comment } from "../../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteComment
{
  constructor(
    @inject("CommentRepository") private commentRepository: CommentRepository,
  ) { }

  async execute(id: string, userId: string): Promise<{ message: string }>
  {
    const { message } = await this.commentRepository.deleteComment(id, userId);

    return { message };
  }
}
