import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { inject, injectable } from "tsyringe";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class UpdateJobPosting {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
    @inject("CacheService") private readonly cacheService: CacheService,
  ) {}

  async execute(
    userId: string,
    jobId: string,
    jobPostingData: Partial<JobPosting>,
  ): Promise<{ message: string; jobPosting: JobPosting }> {
    const { message, jobPosting } =
      await this.jobPostingRepository.updateJobPosting(
        userId,
        jobId,
        jobPostingData,
      );

    await this.cacheService.invalidateKeys("jobs:*");

    return { message, jobPosting };
  }
}
