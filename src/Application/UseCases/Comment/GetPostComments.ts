import { CommentRepository } from "../../../Domain/Repositories/CommentRepository";
import { Comment } from "../../../Domain/Entities/Comment";
import { inject, injectable } from "tsyringe";
import {
  CommentFilter,
  CommentSortOptions,
} from "../../../Infrastructure/Filters/CommentFilter";

@injectable()
export class GetPostComments {
  constructor(
    @inject("CommentRepository")
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(
    id: string,
    sortOptions?: CommentSortOptions,
    offset?: number,
    limit?: number,
  ): Promise<{ comments: Comment[]; totalCount: number }> {
    const filter = new CommentFilter(sortOptions);
    const result = await this.commentRepository.getPostComments(
      id,
      filter,
      offset,
      limit,
    );

    return result;
  }
}
