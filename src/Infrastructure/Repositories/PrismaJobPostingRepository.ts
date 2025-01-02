import { JobPostingRepository } from "../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../Domain/Entities/JobPosting";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";
import { JobPostingStatus, Mode, Prisma } from "@prisma/client";
import { JobPostingFilter } from "../Filters/JobPostingFilter";

@injectable()
export class PrismaJobPostingRepository implements JobPostingRepository {
  async getAllJobPostings(
    filter?: JobPostingFilter,
    offset?: number,
    limit?: number,
  ): Promise<JobPosting[] | null> {
    const whereClause = filter?.buildWhereClause();
    const orderByClause = filter?.buildOrderByClause();
    const jobPostings = await prisma.jobPosting.findMany({
      where: whereClause,
      ...(orderByClause && { orderBy: orderByClause }),
      ...(offset && { skip: offset }),
      ...(limit && { take: limit }),
    });

    return jobPostings;
  }

  async getJobPostingById(id: string): Promise<JobPosting | null> {
    return await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        applicants: true,
        jobAuthor: true,
      },
    });
  }

  async updateJobPosting(
    id: string,
    jobPostingData: Partial<Omit<JobPosting, "applicants" | "jobAuthor">>,
  ): Promise<{ message: string; jobPosting: JobPosting }> {
    const updatedPost = await prisma.jobPosting.update({
      where: { id },
      data: {
        ...jobPostingData,
        updatedAt: new Date(),
      },
    });

    return {
      message: "Job posting updated successfully",
      jobPosting: updatedPost,
    };
  }

  async createJobPosting(
    userId: string,
    jobPostingData: Prisma.JobPostingCreateInput,
  ): Promise<{ message: string; jobPosting: JobPosting }> {
    const userExist = await this.getUserById(userId);

    if (!userExist) {
      throw new Error("User does not exist");
    }

    const createdPost = await prisma.jobPosting.create({
      data: {
        ...jobPostingData,
        jobAuthor: {
          connect: { id: userId },
        },
      },
    });

    return {
      message: "Post created successfully",
      jobPosting: createdPost,
    };
  }

  async deleteJobPosting(id: string): Promise<{ message: string }> {
    const jobPostingExist = await this.getJobPostingById(id);

    if (!jobPostingExist) {
      return {
        message: "Job posting does not exist",
      };
    }

    await prisma.jobPosting.delete({ where: { id } });

    return { message: "Job Posting deleted successfully" };
  }

  async disableJobPosting(id: string): Promise<{ message: string }> {
    const jobPosting = await this.getJobPostingById(id);

    if (!jobPosting) {
      return { message: "Job Posting does not exist" };
    }

    const newStatus = this.getNextStatus(jobPosting.status);

    const updatedJobPosting = await this.updateJobPostingStatus(id, newStatus);

    return {
      message: `Job Posting status updated to ${updatedJobPosting.status} successfully`,
    };
  }

  //HELPERS METHODS
  private getNextStatus(currentStatus: JobPostingStatus): JobPostingStatus {
    return currentStatus === JobPostingStatus.OPEN
      ? JobPostingStatus.CLOSED
      : JobPostingStatus.OPEN;
  }

  private async updateJobPostingStatus(
    id: string,
    newStatus: JobPostingStatus,
  ) {
    return prisma.jobPosting.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  private async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}
