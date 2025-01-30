import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class DisableJobPosting {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
  ) {}

  async execute(jobId: string, userId: string): Promise<{ message: string }> {
    const { message } = await this.jobPostingRepository.disableJobPosting(
      jobId,
      userId,
    );

    return { message };
  }
}
