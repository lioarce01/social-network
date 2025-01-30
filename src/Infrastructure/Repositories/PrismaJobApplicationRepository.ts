import { JobApplicationRepository } from "../../Domain/Repositories/JobApplicationRepository";
import { JobApplication } from "../../Domain/Entities/JobApplication";
import { injectable } from "tsyringe";
import { CustomError } from "../../Shared/CustomError";
import { BasePrismaRepository } from "./BasePrismaRepository";

@injectable()
export class PrismaJobApplicationRepository
  extends BasePrismaRepository<JobApplication>
  implements JobApplicationRepository
{
  entityName = "jobApplication";

  async applyJob(
    userId: string,
    jobPostingId: string,
  ): Promise<{ message: string; jobApplication: JobApplication }> {
    const user = await this.prisma.user.findUnique({ where: { sub: userId } });
    const job = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (!job) {
      throw new CustomError("Job not found", 404);
    }

    const existingApplication = await this.getExistingApplication(
      user.id,
      jobPostingId,
    );

    if (existingApplication) {
      throw new CustomError("You already applied to this job", 400);
    }

    const jobApplication = await this.prisma.jobApplication.create({
      data: {
        userId: user.id,
        jobPostingId,
      },
    });

    return {
      message: "Job application submitted successfully",
      jobApplication,
    };
  }

  async rejectApplicant(
    userId: string,
    ownerId: string,
    jobId: string,
  ): Promise<JobApplication> {
    if (!userId || !jobId) {
      throw new CustomError("Invalid user id, job id", 400);
    }

    const owner = await this.prisma.user.findUnique({
      where: { sub: ownerId },
    });

    const job = await this.prisma.jobPosting.findUnique({
      where: { id: jobId },
      select: { jobAuthorId: true },
    });

    if (!job) {
      throw new CustomError("Job posting not found", 404);
    }

    if (job.jobAuthorId !== owner?.id) {
      throw new CustomError(
        "You are not authorized to reject this applicant",
        403,
      );
    }

    const existingApplication = await this.getExistingApplication(
      userId,
      jobId,
    );

    if (!existingApplication) {
      throw new CustomError("Application not found", 404);
    }

    if (existingApplication.isRejected) {
      throw new CustomError("Application already rejected", 400);
    }

    const result = await this.prisma.jobApplication.update({
      where: { id: existingApplication.id },
      data: { isRejected: true },
    });

    return result;
  }

  //HELPER METHODS
  private async getExistingApplication(userId: string, jobPostingId: string) {
    return await this.prisma.jobApplication.findUnique({
      where: {
        userId_jobPostingId: { userId, jobPostingId },
      },
    });
  }
}
