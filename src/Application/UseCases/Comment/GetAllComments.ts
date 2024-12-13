import { CommentRepository } from "../../../Domain/Repositories/CommentRepository";
import { Comment } from "../../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetAllComments {
  constructor(
    @inject("CommentRepository")
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(offset?: number, limit?: number): Promise<Comment[] | null> {
    const comments = await this.commentRepository.getAllComments(offset, limit);
    return comments;
  }
}
