import { PostLike } from "../../../Domain/Entities/PostLike";
import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../Domain/Repositories/UserRepository";

@injectable()
export class GetUserLikedPosts {
  constructor(
    @inject("UserRepository") private readonly userRepostiroy: UserRepository,
  ) {}

  async execute(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ likedPosts: PostLike[]; totalCount: number }> {
    const result = await this.userRepostiroy.getUserLikedPosts(
      id,
      offset,
      limit,
    );

    return result;
  }
}
