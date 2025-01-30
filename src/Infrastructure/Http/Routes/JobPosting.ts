import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { JobPostingController } from "../Controllers/JobPosting";
import { setupContainer } from "../../DI/Container";
import { AuthMiddleware } from "../../Middlewares/auth";

setupContainer();

const router = express.Router();

const jobPostingController = container.resolve(JobPostingController);
const auth = container.resolve(AuthMiddleware);

router.get("/", (req, res, next) =>
  jobPostingController.getJobPostings(req, res, next),
);
router.get("/:id", (req, res, next) =>
  jobPostingController.getJobPostingById(req, res, next),
);
router.post(
  "/",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) =>
    jobPostingController.createJobPosting(req, res, next),
);
router.put(
  "/:id/update",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) =>
    jobPostingController.updateJobPosting(req, res, next),
);
router.delete(
  "/:id",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) =>
    jobPostingController.deleteJobPosting(req, res, next),
);
router.put("/:id/change-status", (req, res, next) =>
  jobPostingController.disableJobPosting(req, res, next),
);
router.get("/:id/applicants", (req, res, next) =>
  jobPostingController.getJobApplicants(req, res, next),
);

export default router;
