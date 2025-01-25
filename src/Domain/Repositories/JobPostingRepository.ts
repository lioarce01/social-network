import { JobPosting } from "../Entities/JobPosting";
import { JobPostingFilter } from "../../Infrastructure/Filters/JobPostingFilter";
import { Prisma } from "@prisma/client";
import { JobApplication } from "../Entities/JobApplication";

export interface JobPostingRepository {
  getAllJobPostings(
    filter?: JobPostingFilter,
    offset?: number,
    limit?: number,
  ): Promise<{ jobs: JobPosting[]; totalCount: number }>;
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
  getJobApplicants(jobId: string): Promise<JobApplication[] | null>;

  //=========TO DO===========//
  // rejectApplicant(id: string): Promise<{ message: string }>;
}
