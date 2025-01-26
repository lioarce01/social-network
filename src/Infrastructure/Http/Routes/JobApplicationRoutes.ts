import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { JobApplicationController } from "../Controllers/JobApplication";
import { setupContainer } from "../../DI/Container";

setupContainer();

const router = express.Router();

const jobApplicationController = container.resolve(JobApplicationController);

router.post("/applyjob", (req, res, next) =>
  jobApplicationController.applyJob(req, res, next),
);

router.put("/:id/reject-applicant", (req, res, next) =>
  jobApplicationController.rejectApplicant(req, res, next),
);

export default router;
