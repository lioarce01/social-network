import { JobApplication } from "../../../Domain/Entities/JobApplication";
import { JobPosting } from "../../../Domain/Entities/JobPosting";
import { User } from "../../../Domain/Entities/User";
import { JobPostingRepository } from "../../../Domain/Repositories/JobPostingRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetJobApplicants {
  constructor(
    @inject("JobPostingRepository")
    private jobPostingRepository: JobPostingRepository,
  ) {}

  async execute(jobId: string): Promise<Partial<User>[] | null> {
    const applicants = await this.jobPostingRepository.getJobApplicants(jobId);

    return applicants;
  }
}
