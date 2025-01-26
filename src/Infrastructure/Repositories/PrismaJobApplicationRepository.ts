import { JobApplicationRepository } from "../../Domain/Repositories/JobApplicationRepository";
import { JobApplication } from "../../Domain/Entities/JobApplication";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";
import { CustomError } from "../../Shared/CustomError";

@injectable()
export class PrismaJobApplicationRepository
  implements JobApplicationRepository
{
  async applyJob(
    userId: string,
    jobPostingId: string,
  ): Promise<{ message: string; jobApplication: JobApplication }> {
    const existingApplication = await this.getExistingApplication(
      userId,
      jobPostingId,
    );

    if (existingApplication) {
      return {
        message: "You already applied to this job posting",
        jobApplication: existingApplication,
      };
    }

    const jobApplication = await prisma.jobApplication.create({
      data: {
        userId,
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
    jobId: string,
  ): Promise<JobApplication> {
    if (!userId || !jobId) {
      throw new CustomError("Invalid user id or job id", 400);
    }

    if (userId === jobId) {
      throw new CustomError("Invalid user id or job id", 400);
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

    const result = await prisma.jobApplication.update({
      where: { id: existingApplication.id },
      data: { isRejected: true },
    });

    return result;
  }

  //HELPER METHODS
  private async getExistingApplication(userId: string, jobPostingId: string) {
    return await prisma.jobApplication.findUnique({
      where: {
        userId_jobPostingId: { userId, jobPostingId },
      },
    });
  }
}
