import { CommentRepository } from "../../../Domain/Repositories/CommentRepository";
import { Comment } from "../../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetPostComments {
  constructor(
    @inject("CommentRepository")
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(
    id: string,
  ): Promise<{ comments: Comment[]; totalCount: number }> {
    const result = await this.commentRepository.getPostComments(id);

    return result;
  }
}
