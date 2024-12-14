import "reflect-metadata";
import express, { Router } from "express";
import { container } from "tsyringe";
import { CommentController } from "../Controllers/Comment";
import { setupContainer } from "../../DI/Container";

setupContainer();

const router = express.Router();

const commentController = container.resolve(CommentController);

router.get("/", (req, res, next) =>
  commentController.getAllComments(req, res, next),
);
router.get("/user/:id", (req, res, next) =>
  commentController.getUserComments(req, res, next),
);
router.get("/post/:id", (req, res, next) =>
  commentController.getPostComments(req, res, next),
);
router.post("/", (req, res, next) =>
  commentController.createComment(req, res, next),
);
router.delete("/delete", (req, res, next) =>
  commentController.deleteComment(req, res, next),
);
router.put("/update", (req, res, next) =>
  commentController.updateComment(req, res, next),
);

export default router;
