import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ApplyJob } from "../../../Application/UseCases/JobAppliation/ApplyJob";

@injectable()
export class JobApplicationController {
  constructor(@inject("ApplyJob") private applyJobUseCase: ApplyJob) {}

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
}
