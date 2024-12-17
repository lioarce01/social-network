import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { GetJobPostings } from "../../../Application/UseCases/JobPosting/GetJobPostings";
import { GetJobPostingById } from "../../../Application/UseCases/JobPosting/GetJobPostingById";
import { UpdateJobPosting } from "../../../Application/UseCases/JobPosting/UpdateJobPosting";
import { CreateJobPosting } from "../../../Application/UseCases/JobPosting/CreateJobPosting";
import { DeleteJobPosting } from "../../../Application/UseCases/JobPosting/DeleteJobPosting";
import { DisableJobPosting } from "../../../Application/UseCases/JobPosting/DisableJobPosting";
import { JobPostingStatus, Prisma } from "@prisma/client";

@injectable()
export class JobPostingController {
  constructor(
    @inject("GetJobPostings") private getJobPostingsUseCase: GetJobPostings,
    @inject("GetJobPostingById")
    private getJobPostingByIdUseCase: GetJobPostingById,
    @inject("UpdateJobPosting")
    private updateJobPostingUseCase: UpdateJobPosting,
    @inject("CreateJobPosting")
    private createJobPostingUseCase: CreateJobPosting,
    @inject("DeleteJobPosting")
    private deleteJobPostingUseCase: DeleteJobPosting,
    @inject("DisableJobPosting")
    private disableJobPostingUseCase: DisableJobPosting,
  ) {}

  async getJobPostings(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset, limit } = req.query;

      const parsedOffset =
        typeof offset === "string" && offset.trim() !== ""
          ? Number(offset)
          : undefined;
      const parsedLimit =
        typeof limit === "string" && limit.trim() !== ""
          ? Number(limit)
          : undefined;

      const jobPostings = await this.getJobPostingsUseCase.execute(
        parsedOffset,
        parsedLimit,
      );

      if (!jobPostings || jobPostings.length === 0) {
        return res.status(404).json({ message: "No job postings found" });
      }

      res.status(200).json(jobPostings);
    } catch (e) {
      next(e);
    }
  }

  async getJobPostingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const jobPosting = await this.getJobPostingByIdUseCase.execute(id);

      if (!jobPosting) {
        return res.status(404).json({ message: "Job posting not found" });
      }

      res.status(200).json(jobPosting);
    } catch (e) {
      next(e);
    }
  }

  async createJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        userId,
        title,
        description,
        budget,
        deadline,
        techRequired,
        category,
      } = req.body;

      if (
        !title ||
        !description ||
        !budget ||
        !deadline ||
        !techRequired ||
        !category
      ) {
        return res
          .status(400)
          .json({ message: "Job posting data is required" });
      }

      const postingData: Prisma.JobPostingCreateInput = {
        title,
        description,
        budget,
        deadline: new Date(deadline),
        techRequired,
        category,
        status: JobPostingStatus.OPEN,
        jobAuthor: {
          connect: {
            id: userId,
          },
        },
      };

      const { message, jobPosting } =
        await this.createJobPostingUseCase.execute(userId, postingData);

      res.status(201).json({ message, jobPosting });
    } catch (e) {
      next(e);
    }
  }

  async updateJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, budget, deadline, techRequired, category } =
        req.body;
      const { id } = req.params;

      const { message, jobPosting } =
        await this.updateJobPostingUseCase.execute(id, {
          title,
          description,
          budget,
          deadline: new Date(deadline),
          techRequired,
          category,
        });

      res.status(200).json({ message, jobPosting });
    } catch (e) {
      next(e);
    }
  }

  async deleteJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { message } = await this.deleteJobPostingUseCase.execute(id);

      res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  async disableJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { message } = await this.disableJobPostingUseCase.execute(id);

      res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }
}