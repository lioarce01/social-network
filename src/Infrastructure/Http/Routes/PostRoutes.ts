import "reflect-metadata";
import express, { NextFunction } from "express";
import { container } from "tsyringe";
import { PostController } from "../Controllers/Post";
import { setupContainer } from "../../DI/Container";
import { AuthMiddleware } from "../../Middlewares/auth";

setupContainer();

const router = express.Router();

const postController = container.resolve(PostController);
const auth = container.resolve(AuthMiddleware);

router.get("/", (req, res, next) => postController.getAllPosts(req, res, next));

router.get("/:id", (req, res, next) =>
  postController.getPostById(req, res, next),
);

router.get("/user/:id", (req, res, next) =>
  postController.getUserPosts(req, res, next),
);

router.post(
  "/",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => postController.createPost(req, res, next),
);

router.delete(
  "/delete",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => postController.deletePost(req, res, next),
);

router.put(
  "/update",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => postController.updatePost(req, res, next),
);

router.put(
  "/like",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => postController.likePost(req, res, next),
);

router.put(
  "/unlike",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => postController.unlikePost(req, res, next),
);

export default router;
