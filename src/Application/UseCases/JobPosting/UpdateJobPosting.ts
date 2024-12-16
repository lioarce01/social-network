import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateJobPosting {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
  ) {}

  async execute(
    id: string,
    jobPostingData: Partial<JobPosting>,
  ): Promise<{ message: string; jobPosting: JobPosting }> {
    const { message, jobPosting } =
      await this.jobPostingRepository.updateJobPosting(id, jobPostingData);

    return { message, jobPosting };
  }
}
