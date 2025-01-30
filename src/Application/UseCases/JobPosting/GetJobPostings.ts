import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { inject, injectable } from "tsyringe";
import {
  JobPostingFilter,
  JobPostingFilters,
  JobPostingSortOptions,
} from "../../../Infrastructure/Filters/JobPostingFilter";
import { CacheRepository } from "../../../Domain/Repositories/CacheRepository";

@injectable()
export class GetJobPostings {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
    @inject("CacheRepository")
    private readonly cacheRepository: CacheRepository,
  ) {}

  async execute(
    filters?: JobPostingFilters,
    sortOptions?: JobPostingSortOptions,
    offset?: number,
    limit?: number,
  ): Promise<{ jobs: JobPosting[]; totalCount: number }> {
    const cacheKey = `jobs:offset=${offset}&limit=${limit}&sort=${sortOptions?.sortBy}&order=${sortOptions?.sortOrder}&filterByMode${filters?.mode}&filterBySearchTerm${filters?.searchTerm}&filterByStatus${filters?.status}`;
    const cachedJobs = await this.cacheRepository.get(cacheKey);

    if (cachedJobs) {
      console.log("Cache hit for key:", cacheKey);
      return JSON.parse(cachedJobs);
    }

    console.log("Cache miss for key:", cacheKey);
    const filter = new JobPostingFilter(filters, sortOptions);
    const result = await this.jobPostingRepository.getAllJobPostings(
      filter,
      offset,
      limit,
    );

    //cache result for 30min
    await this.cacheRepository.set(cacheKey, JSON.stringify(result), 1800);

    console.log("Data cached for key:", cacheKey);
    return result;
  }
}
