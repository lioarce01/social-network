import "reflect-metadata";
import express, { Router } from "express";
import { container } from "tsyringe";
import { CommentController } from "../Controllers/Comment";
import { setupContainer } from "../../DI/Container";
import { AuthMiddleware } from "../../Middlewares/auth";

setupContainer();

const router = express.Router();
const auth = container.resolve(AuthMiddleware);

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
router.post("/", auth.authenticate(), auth.handleError,
  (req: any, res: any, next: any) =>
    commentController.createComment(req, res, next),
);
router.delete("/delete", auth.authenticate(), auth.handleError,
  (req: any, res: any, next: any) =>
    commentController.deleteComment(req, res, next),
);
router.put("/update", auth.authenticate(), auth.handleError,
  (req: any, res: any, next: any) =>
    commentController.updateComment(req, res, next),
);

export default router;
