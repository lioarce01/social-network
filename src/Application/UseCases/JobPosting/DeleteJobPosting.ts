import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { inject, injectable } from "tsyringe";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class DeleteJobPosting {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
    @inject("CacheService") private readonly cacheService: CacheService,
  ) {}

  async execute(jobId: string, authorId: string): Promise<{ message: string }> {
    const { message } = await this.jobPostingRepository.deleteJobPosting(
      jobId,
      authorId,
    );

    await this.cacheService.invalidateKeys("jobs:*");

    return { message };
  }
}
