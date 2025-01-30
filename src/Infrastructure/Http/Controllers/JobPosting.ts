import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { GetJobPostings } from "../../../Application/UseCases/JobPosting/GetJobPostings";
import { GetJobPostingById } from "../../../Application/UseCases/JobPosting/GetJobPostingById";
import { UpdateJobPosting } from "../../../Application/UseCases/JobPosting/UpdateJobPosting";
import { CreateJobPosting } from "../../../Application/UseCases/JobPosting/CreateJobPosting";
import { DeleteJobPosting } from "../../../Application/UseCases/JobPosting/DeleteJobPosting";
import { DisableJobPosting } from "../../../Application/UseCases/JobPosting/DisableJobPosting";
import { GetJobApplicants } from "../../../Application/UseCases/JobPosting/GetJobApplicants";
import { JobPostingStatus, Mode, Prisma } from "@prisma/client";

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
    @inject("GetJobApplicants")
    private getJobApplicantsUseCase: GetJobApplicants,
  ) {}

  async getJobPostings(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        status,
        category,
        sortBy,
        sortOrder,
        offset,
        limit,
        searchTerm,
        mode,
      } = req.query;

      let parsedMode: Mode | undefined;
      if (mode) {
        const validModes = Object.values(Mode);
        if (validModes.includes(mode as Mode)) {
          parsedMode = mode as Mode;
        }
      }

      const filters = {
        status: status ? (status as JobPostingStatus) : undefined,
        category: category as string,
        searchTerm: searchTerm as string,
        mode: parsedMode,
      };

      const sortOptions = {
        sortBy: sortBy as "budget" | "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
      };

      const parsedOffset =
        typeof offset === "string" && offset.trim() !== ""
          ? Number(offset)
          : undefined;
      const parsedLimit =
        typeof limit === "string" && limit.trim() !== ""
          ? Number(limit)
          : undefined;

      const { jobs, totalCount } = await this.getJobPostingsUseCase.execute(
        filters,
        sortOptions,
        parsedOffset,
        parsedLimit,
      );

      return res.status(200).json({
        jobs,
        totalCount,
      });
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

      return res.status(200).json(jobPosting);
    } catch (e) {
      next(e);
    }
  }

  async createJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        description,
        budget,
        deadline,
        techRequired,
        category,
        location,
        mode,
        experience_level,
      } = req.body;

      const userId = req.auth?.sub;

      if (
        !title ||
        !description ||
        !budget ||
        !deadline ||
        !techRequired ||
        !category
      ) {
        return res.status(400).json({
          code: 400,
          status: "BAD_REQUEST",
          message: "Missing required fields",
        });
      }

      const postingData: Prisma.JobPostingCreateInput = {
        title,
        description,
        budget,
        deadline: new Date(deadline),
        techRequired,
        category,
        status: JobPostingStatus.OPEN,
        location,
        mode,
        experience_level,
        jobAuthor: {
          connect: {
            id: userId,
          },
        },
      };

      const { message, jobPosting } =
        await this.createJobPostingUseCase.execute(userId!, postingData);

      return res.status(201).json({
        code: 201,
        status: "SUCCESS",
        message: message,
        jobPosting: jobPosting,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const updates = { ...req.body };
      const { id } = req.params;
      const userId = req.auth?.sub;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          code: 400,
          status: "BAD_REQUEST",
          message: "Missing required fields",
        });
      }

      if (updates.deadline) {
        updates.deadline = new Date(updates.deadline);
      }

      const { message, jobPosting } =
        await this.updateJobPostingUseCase.execute(userId!, id, updates);

      return res.status(200).json({
        code: 200,
        status: "SUCCESS",
        message: message,
        jobPosting: jobPosting,
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { message } = await this.deleteJobPostingUseCase.execute(id);

      return res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  async disableJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { message } = await this.disableJobPostingUseCase.execute(id);

      return res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  async getJobApplicants(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;

      const jobApplicants = await this.getJobApplicantsUseCase.execute(
        id,
        offset,
        limit,
      );

      return res.status(200).json(jobApplicants);
    } catch (e) {
      next(e);
    }
  }
}
