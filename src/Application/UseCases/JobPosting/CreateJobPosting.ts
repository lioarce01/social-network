import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { inject, injectable } from "tsyringe";
import { Prisma } from "@prisma/client";

@injectable()
export class CreateJobPosting {
  constructor(
    @inject("JobPostingRepository")
    private readonly jobPostingRepository: JobPostingRepository,
  ) {}

  async execute(
    id: string,
    jobPostingData: Prisma.JobPostingCreateInput,
  ): Promise<{ message: string; jobPosting: JobPosting }> {
    const { message, jobPosting } =
      await this.jobPostingRepository.createJobPosting(id, jobPostingData);

    return { message, jobPosting };
  }
}
