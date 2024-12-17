import { JobApplicationRepository } from "../../Domain/Repositories/JobApplicationRepository";
import { JobApplication } from "../../Domain/Entities/JobApplication";
import { prisma } from "../../config/config";
import { injectable } from "tsyringe";

@injectable()
export class PrismaJobApplicationRepository
  implements JobApplicationRepository
{
  private async getExistingApplication(userId: string, jobPostingId: string) {
    return await prisma.jobApplication.findUnique({
      where: {
        userId_jobPostingId: { userId, jobPostingId },
      },
    });
  }

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
        message: "You have already applied to this job posting",
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
}
