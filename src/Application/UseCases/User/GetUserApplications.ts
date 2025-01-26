import { JobApplication } from "../../../Domain/Entities/JobApplication";
import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserApplications {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    offset?: number,
    limit?: number,
  ): Promise<{ jobApplications: JobApplication[]; totalCount: number }> {
    const result = await this.userRepository.getUserApplications(
      userId,
      offset,
      limit,
    );

    return result;
  }
}
