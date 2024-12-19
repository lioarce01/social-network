import { JobPostingRepository } from "../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../Domain/Entities/JobPosting";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";
import { JobPostingStatus, Prisma } from "@prisma/client";
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
      orderBy: orderByClause,
      ...(typeof offset !== "undefined" && { skip: offset }),
      ...(typeof limit !== "undefined" && { take: limit }),
    });

    return jobPostings;
  }

  async getJobPostingById(id: string): Promise<JobPosting | null> {
    return await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        applicants: true,
      },
    });
  }

  async updateJobPosting(
    id: string,
    jobPostingData: {
      title: string;
      description: string;
      budget: number;
      deadline: Date;
      techRequired: string[];
      category: string;
    },
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
    id: string,
    jobPostingData: Prisma.JobPostingCreateInput,
  ): Promise<{ message: string; jobPosting: JobPosting }> {
    const userExist = await prisma.user.findUnique({ where: { id } });

    if (!userExist) {
      throw new Error("User does not exist");
    }

    const createdPost = await prisma.jobPosting.create({
      data: {
        ...jobPostingData,
        jobAuthor: {
          connect: { id: jobPostingData.jobAuthor.connect?.id },
        },
      },
    });

    return {
      message: "Post created successfully",
      jobPosting: createdPost,
    };
  }

  async deleteJobPosting(id: string): Promise<{ message: string }> {
    const jobPostingExist = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!jobPostingExist) {
      return {
        message: "Job posting does not exist",
      };
    }

    await prisma.jobPosting.delete({ where: { id } });

    return { message: "Job Posting deleted successfully" };
  }

  async disableJobPosting(id: string): Promise<{ message: string }> {
    const jobPostingExist = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!jobPostingExist) {
      return { message: "Job Posting does not exist" };
    }

    const changeStatus =
      jobPostingExist.status === JobPostingStatus.OPEN
        ? JobPostingStatus.CLOSED
        : JobPostingStatus.OPEN;

    const updatedJobPosting = await prisma.jobPosting.update({
      where: { id },
      data: { status: changeStatus },
    });

    return {
      message: `Job Posting status updated to ${updatedJobPosting.status} successfully`,
    };
  }
}
