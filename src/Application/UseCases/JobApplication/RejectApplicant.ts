import { JobApplication } from "../../../Domain/Entities/JobApplication";
import { JobApplicationRepository } from "../../../Domain/Repositories/JobApplicationRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class RejectApplicant {
  constructor(
    @inject("JobApplicationRepository")
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(userId: string, jobId: string): Promise<JobApplication> {
    const result = await this.jobApplicationRepository.rejectApplicant(
      userId,
      jobId,
    );

    return result;
  }
}
