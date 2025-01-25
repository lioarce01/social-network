import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserJobPostings {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(
    id: string,
    offset?: number,
    limit?: number,
  ): Promise<{ jobPostings: JobPosting[]; totalCount: number }> {
    const result = await this.userRepository.getUserJobPostings(
      id,
      offset,
      limit,
    );
    return result;
  }
}
