import { JobApplication } from "../../../Domain/Entities/JobApplication";
import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetJobApplicants {
  constructor(
    @inject("JobPostingRepository")
    private jobPostingRepository: JobPostingRepository,
  ) {}

  async execute(
    jobId: string,
    offset?: number,
    limit?: number,
  ): Promise<{ applications: JobApplication[]; totalCount: number }> {
    const applicants = await this.jobPostingRepository.getJobApplicants(
      jobId,
      offset,
      limit,
    );

    return applicants;
  }
}
