import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { PostController } from "../Controllers/Post";
import { setupContainer } from "../../DI/Container";

setupContainer();

const router = express.Router();

const postController = container.resolve(PostController);

router.get("/", (req, res, next) => postController.getAllPosts(req, res, next));
router.get("/:id", (req, res, next) =>
  postController.getPostById(req, res, next),
);
router.get("/user/:id", (req, res, next) =>
  postController.getUserPosts(req, res, next),
);
router.post("/", (req, res, next) => postController.createPost(req, res, next));
router.delete("/delete", (req, res, next) =>
  postController.deletePost(req, res, next),
);
router.put("/update", (req, res, next) =>
  postController.updatePost(req, res, next),
);
router.put("/like", (req, res, next) =>
  postController.likePost(req, res, next),
);
router.put("/unlike", (req, res, next) =>
  postController.unlikePost(req, res, next),
);

export default router;
