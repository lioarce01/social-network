import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { inject, injectable } from "tsyringe";
import {
  JobPostingFilter,
  JobPostingFilters,
  JobPostingSortOptions,
} from "../../../Infrastructure/Filters/JobPostingFilter";

@injectable()
export class GetJobPostings {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
  ) {}

  async execute(
    filters?: JobPostingFilters,
    sortOptions?: JobPostingSortOptions,
    offset?: number,
    limit?: number,
  ): Promise<{ jobs: JobPosting[]; totalCount: number }> {
    const filter = new JobPostingFilter(filters, sortOptions);
    const result = await this.jobPostingRepository.getAllJobPostings(
      filter,
      offset,
      limit,
    );

    return result;
  }
}
