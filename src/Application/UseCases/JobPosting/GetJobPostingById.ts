import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetJobPostingById {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
  ) {}

  async execute(id: string): Promise<JobPosting | null> {
    const jobPosting = await this.jobPostingRepository.getJobPostingById(id);

    return jobPosting;
  }
}
