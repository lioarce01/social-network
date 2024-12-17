import { JobApplication } from "../../../Domain/Entities/JobApplication";
import { JobApplicationRepository } from "../../../Domain/Repositories/JobApplicationRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class ApplyJob {
  constructor(
    @inject("JobApplicationRepository")
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(
    userId: string,
    jobPostingId: string,
  ): Promise<{ message: string; jobApplication: JobApplication }> {
    const { message, jobApplication } =
      await this.jobApplicationRepository.applyJob(userId, jobPostingId);
    return { message, jobApplication };
  }
}
