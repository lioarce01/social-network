import { Prisma } from "@prisma/client";
import { JobPosting } from "../Entities/JobPosting";

export interface JobPostingRepository {
  getAllJobPostings(
    offset?: number,
    limit?: number,
  ): Promise<JobPosting[] | null>;
  getJobPostingById(id: string): Promise<JobPosting | null>;
  updateJobPosting(
    id: string,
    jobPostingData: Partial<JobPosting>,
  ): Promise<{ message: string; jobPosting: JobPosting }>;
  createJobPosting(
    id: string,
    jobPostingData: Prisma.JobPostingCreateInput,
  ): Promise<{ message: string; jobPosting: JobPosting }>;
  deleteJobPosting(id: string): Promise<{ message: string }>;
  disableJobPosting(id: string): Promise<{ message: string }>;
}
