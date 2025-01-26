import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ApplyJob } from "../../../Application/UseCases/JobApplication/ApplyJob";
import { RejectApplicant } from "../../../Application/UseCases/JobApplication/RejectApplicant";

@injectable()
export class JobApplicationController {
  constructor(
    @inject("ApplyJob") private applyJobUseCase: ApplyJob,
    @inject("RejectApplicant") private rejectApplicantUseCase: RejectApplicant,
  ) {}

  async applyJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, jobPostingId } = req.body;
      const { message, jobApplication } = await this.applyJobUseCase.execute(
        userId,
        jobPostingId,
      );

      res.status(201).json({ message, jobApplication });
    } catch (e) {
      next(e);
    }
  }

  async rejectApplicant(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      const result = await this.rejectApplicantUseCase.execute(userId, id);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}
