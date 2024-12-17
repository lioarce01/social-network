import express from "express";
import userRoutes from "./UserRoutes";
import postRoutes from "./PostRoutes";
import commentRoutes from "./CommentRoutes";
import jobPostingRoutes from "./JobPosting";
import jobApplicationRoutes from "./JobApplicationRoutes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/jobpostings", jobPostingRoutes);
router.use("/jobapplications", jobApplicationRoutes);

export default router;
