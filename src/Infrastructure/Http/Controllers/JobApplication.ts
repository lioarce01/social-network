import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ApplyJob } from "../../../Application/UseCases/JobApplication/ApplyJob";
import { RejectApplicant } from "../../../Application/UseCases/JobApplication/RejectApplicant";

@injectable()
export class JobApplicationController
{
  constructor(
    @inject("ApplyJob") private applyJobUseCase: ApplyJob,
    @inject("RejectApplicant") private rejectApplicantUseCase: RejectApplicant,
  ) { }


  async applyJob(req: Request, res: Response, next: NextFunction)
  {
    try {
      const { jobPostingId } = req.body;
      const userId = req.auth!.sub

      if (!jobPostingId) {
        return res.status(400).json({
          code: 400,
          status: "BAD_REQUEST",
          message: "Job posting ID is required",
        });
      }

      const { message, jobApplication } = await this.applyJobUseCase.execute(
        userId!,
        jobPostingId,
      );

      res.status(201).json({
        code: 201,
        status: "SUCCESS",
        message,
        jobApplication,
      });
    } catch (e) {
      next(e);
    }
  }

  async rejectApplicant(req: Request, res: Response, next: NextFunction)
  {
    const { id } = req.params;
    const { userId } = req.body;
    const ownerId = req.auth!.sub

    try {
      const result = await this.rejectApplicantUseCase.execute(
        userId,
        ownerId!,
        id,
      );

      return res.status(200).json({
        code: 200,
        status: "SUCCESS",
        message: "Applicant rejected successfully",
        result,
      });
    } catch (e) {
      next(e);
    }
  }
}
