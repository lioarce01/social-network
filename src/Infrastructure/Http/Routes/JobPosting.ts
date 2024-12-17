import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { JobPostingController } from "../Controllers/JobPosting";
import { setupContainer } from "../../DI/Container";

setupContainer();

const router = express.Router();

const jobPostingController = container.resolve(JobPostingController);

router.get("/", (req, res, next) =>
  jobPostingController.getJobPostings(req, res, next),
);
router.get("/:id", (req, res, next) =>
  jobPostingController.getJobPostingById(req, res, next),
);
router.post("/", (req, res, next) =>
  jobPostingController.createJobPosting(req, res, next),
);
router.put("/:id/update", (req, res, next) =>
  jobPostingController.updateJobPosting(req, res, next),
);
router.delete("/:id", (req, res, next) =>
  jobPostingController.deleteJobPosting(req, res, next),
);
router.put("/:id/change-status", (req, res, next) =>
  jobPostingController.disableJobPosting(req, res, next),
);

export default router;
