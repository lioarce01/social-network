import { JobPostingRepository } from "../../Domain/Repositories/JobPostingRepository";
import { JobPosting } from "../../Domain/Entities/JobPosting";
import { injectable } from "tsyringe";
import { JobApplication, JobPostingStatus, Mode, Prisma } from "@prisma/client";
import { JobPostingFilter } from "../Filters/JobPostingFilter";
import { ExperienceLevel } from "../../types/JobPosting";
import { BasePrismaRepository } from "./BasePrismaRepository";
import { CustomError } from "../../Shared/CustomError";

@injectable()
export class PrismaJobPostingRepository
  extends BasePrismaRepository<JobPosting>
  implements JobPostingRepository
{
  entityName = "jobPosting";

  async getAllJobPostings(
    filter?: JobPostingFilter,
    offset?: number,
    limit?: number,
  ): Promise<{ jobs: JobPosting[]; totalCount: number }>
  {
    const whereClause = filter?.buildWhereClause();
    const orderByClause = filter?.buildOrderByClause();

    const jobs = (
      await this.prisma.jobPosting.findMany({
        where: whereClause,
        orderBy: orderByClause,
        ...(offset && { skip: offset }),
        ...(limit && { take: limit }),
      })
    ).map((job) => ({
      ...job,
      experience_level: job.experience_level as ExperienceLevel,
    }));

    const totalCount = await this.prisma.jobPosting.count({
      where: whereClause,
    });

    return { jobs, totalCount };
  }

  async getJobPostingById(id: string): Promise<JobPosting | null>
  {
    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        applicants: true,
        jobAuthor: true,
      },
    });

    if (!jobPosting) {
      return null;
    }

    const transformedJobPosting: JobPosting = {
      ...jobPosting,
      experience_level: jobPosting.experience_level as ExperienceLevel,
      jobAuthor: jobPosting.jobAuthor
        ? {
          ...jobPosting.jobAuthor,
          name: jobPosting.jobAuthor.name ?? "",
          headline: jobPosting.jobAuthor.headline ?? undefined,
          country: jobPosting.jobAuthor.country ?? undefined,
          postal_code: jobPosting.jobAuthor.postal_code ?? undefined,
          city: jobPosting.jobAuthor.city ?? undefined,
          email: jobPosting.jobAuthor.email ?? "",
          profile_pic: jobPosting.jobAuthor.profile_pic ?? "",
          current_position: jobPosting.jobAuthor.current_position ?? undefined,
        }
        : undefined,
    };

    return transformedJobPosting;
  }

  async updateJobPosting(
    userId: string,
    jobId: string,
    jobPostingData: Partial<Omit<JobPosting, "applicants" | "jobAuthor">>,
  ): Promise<{ message: string; jobPosting: JobPosting }>
  {
    const user = await this.prisma.user.findUnique({ where: { sub: userId } });
    const job = await this.prisma.jobPosting.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new CustomError("Job posting not found", 404);
    }

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (user.id === job.jobAuthorId) {
      const updatedPost = await this.prisma.jobPosting.update({
        where: { id: jobId },
        data: {
          ...jobPostingData,
          updatedAt: new Date(),
        },
      });
      return {
        message: "Job posting updated successfully",
        jobPosting: {
          ...updatedPost,
          experience_level: updatedPost.experience_level as ExperienceLevel,
        },
      };
    }

    throw new CustomError("You are not the author of this job posting", 403);
  }

  async createJobPosting(
    userId: string,
    jobPostingData: Prisma.JobPostingCreateInput,
  ): Promise<{ message: string; jobPosting: JobPosting }>
  {
    const user = await this.prisma.user.findUnique({ where: { sub: userId } });

    if (!user) {
      throw new CustomError("User does not exist", 404);
    }

    const createdPost = await this.prisma.jobPosting.create({
      data: {
        ...jobPostingData,
        jobAuthor: {
          connect: { id: user.id },
        },
      },
    });

    return {
      message: "Post created successfully",
      jobPosting: {
        ...createdPost,
        experience_level: createdPost.experience_level as ExperienceLevel,
      },
    };
  }

  async deleteJobPosting(
    jobId: string,
    authorId: string,
  ): Promise<{ message: string }>
  {
    const user = await this.prisma.user.findUnique({
      where: { sub: authorId },
    });

    if (!user) {
      throw new CustomError("User does not exist", 404);
    }

    const job = await this.getJobPostingById(jobId);

    if (!job) {
      throw new CustomError("Job not found", 404);
    }

    if (user.id === job.jobAuthorId || user.role === "ADMIN") {
      await this.prisma.jobPosting.delete({ where: { id: jobId } });
      return { message: "Job Posting deleted successfully" };
    }

    throw new CustomError(
      "You are not authorized to delete this job posting",
      403,
    );
  }

  async disableJobPosting(
    jobId: string,
    userId: string,
  ): Promise<{ message: string }>
  {
    const user = await this.prisma.user.findUnique({ where: { sub: userId } });
    const job = await this.getJobPostingById(jobId);

    if (!job) {
      throw new CustomError("Job not found", 404);
    }

    const newStatus = this.getNextStatus(job.status);

    if (user?.id === job.jobAuthorId || user?.role === "ADMIN") {
      const updatedJobPosting = await this.updateJobPostingStatus(
        jobId,
        newStatus,
      );

      return {
        message: `Job Posting status updated to: ${updatedJobPosting.status}`,
      };
    }

    throw new CustomError(
      " You are not authorized to update this job posting",
      403,
    );
  }

  async getJobApplicants(
    jobId: string,
    userId: string,
    offset?: number,
    limit?: number,
  ): Promise<{ applications: JobApplication[]; totalCount: number }>
  {
    const user = await this.prisma.user.findUnique({ where: { sub: userId } });
    const job = await this.prisma.jobPosting.findUnique({
      where: { id: jobId },
      select: { jobAuthorId: true },
    });

    if (!job) {
      throw new CustomError("Job posting not found", 404);
    }

    const isOwner = job?.jobAuthorId === user?.id;
    const isAdmin = user?.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      throw new CustomError(
        "You are not authorized to view these applicants",
        403,
      );
    }

    const applicants = await this.prisma.jobApplication.findMany({
      where: {
        jobPostingId: jobId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_pic: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });

    const totalCount = await this.prisma.jobApplication.count({
      where: {
        jobPostingId: jobId,
      },
    });

    return {
      applications: applicants,
      totalCount: totalCount,
    };
  }

  //HELPERS METHODS
  private getNextStatus(currentStatus: JobPostingStatus): JobPostingStatus
  {
    return currentStatus === JobPostingStatus.OPEN
      ? JobPostingStatus.CLOSED
      : JobPostingStatus.OPEN;
  }

  private async updateJobPostingStatus(
    id: string,
    newStatus: JobPostingStatus,
  )
  {
    return this.prisma.jobPosting.update({
      where: { id },
      data: { status: newStatus },
    });
  }
  private async getUserById(id: string)
  {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
