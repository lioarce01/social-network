import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetJobPostings {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
  ) {}

  async execute(): Promise<JobPosting[] | null> {
    const jobPostings = await this.jobPostingRepository.getAllJobPostings();

    return jobPostings;
  }
}
