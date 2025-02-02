import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { UserController } from "../Controllers/User";
import { setupContainer } from "../../DI/Container";
import { AuthMiddleware } from "../../Middlewares/auth";

setupContainer();

const router = express.Router();

const userController = container.resolve(UserController);
const auth = container.resolve(AuthMiddleware);

router.get("/", (req, res, next) => userController.getAllUsers(req, res, next));

router.get("/me",
  auth.authenticate(),
  auth.handleError, (req: any, res: any, next: any) => userController.getMe(req, res, next))

router.post(
  "/",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => userController.createUser(req, res, next),
);

router.put(
  "/disable",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => userController.disableUser(req, res, next),
);

router.put(
  "/switch-role",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) =>
    userController.switchUserRole(req, res, next),
);

router.post(
  "/follow",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => userController.followUser(req, res, next),
);

router.delete(
  "/unfollow",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) =>
    userController.unfollowUser(req, res, next),
);

router.get("/:id/applications", (req, res, next) =>
  userController.getUserApplications(req, res, next),
);

router.get("/:id/job-postings", (req, res, next) =>
  userController.getUserJobPostings(req, res, next),
);

router.get("/:id/liked-posts", (req, res, next) =>
  userController.getUserLikedPosts(req, res, next),
);

router.get("/:id/followers", (req, res, next) =>
  userController.getUserFollowers(req, res, next),
);

router.get("/:id/following", (req, res, next) =>
  userController.getUserFollowing(req, res, next),
);

router.get("/:identifier", (req, res, next) =>
  userController.getUserByIdentifier(req, res, next),
);

router.delete(
  "/:id",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => userController.deleteUser(req, res, next),
);

router.put(
  "/:id/update",
  auth.authenticate(),
  auth.handleError,
  (req: any, res: any, next: any) => userController.updateUser(req, res, next),
);

export default router;
