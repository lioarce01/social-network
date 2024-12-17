import { JobApplication } from "../Entities/JobApplication";

export interface JobApplicationRepository {
  applyJob(userId: string, jobId: string): Promise<JobApplication | null>;
}
