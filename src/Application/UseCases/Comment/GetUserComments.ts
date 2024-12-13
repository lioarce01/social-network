import { CommentRepository } from "../../../Domain/Repositories/CommentRepository";
import { Comment } from "../../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserComments {
  constructor(
    @inject("CommentRepository")
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(id: string): Promise<Comment[] | null> {
    const comments = await this.commentRepository.getUserComments(id);

    return comments;
  }
}
