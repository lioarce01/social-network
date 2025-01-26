import { JobApplication } from "../Entities/JobApplication";

export interface JobApplicationRepository {
  applyJob(
    userId: string,
    jobId: string,
  ): Promise<{ message: string; jobApplication: JobApplication }>;
  rejectApplicant(userId: string, jobId: string): Promise<JobApplication>;
}
