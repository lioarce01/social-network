import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { JobApplicationController } from "../Controllers/JobApplication";
import { setupContainer } from "../../DI/Container";
import { AuthMiddleware } from "../../Middlewares/auth";

setupContainer();

const router = express.Router();

const jobApplicationController = container.resolve(JobApplicationController);
const auth = container.resolve(AuthMiddleware);

router.post(
  "/applyjob",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) =>
    jobApplicationController.applyJob(req, res, next),
);

router.put(
  "/:id/reject-applicant",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) =>
    jobApplicationController.rejectApplicant(req, res, next),
);

export default router;
