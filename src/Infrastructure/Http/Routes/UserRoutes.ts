import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { UserController } from "../Controllers/User";
import { setupContainer } from "../../DI/Container";

setupContainer();

const router = express.Router();

const userController = container.resolve(UserController);

router.get("/", (req, res, next) => userController.getAllUsers(req, res, next));

router.get("/applications", (req, res, next) =>
  userController.getUserApplications(req, res, next),
);

router.post("/", (req, res, next) => userController.createUser(req, res, next));

router.put("/disable", (req, res, next) =>
  userController.disableUser(req, res, next),
);

router.put("/switch-role", (req, res, next) =>
  userController.switchUserRole(req, res, next),
);

router.post("/follow", (req, res, next) =>
  userController.followUser(req, res, next),
);

router.delete("/unfollow", (req, res, next) =>
  userController.unfollowUser(req, res, next),
);

router.get("/:identifier", (req, res, next) =>
  userController.getUserByIdentifier(req, res, next),
);

router.delete("/:id", (req, res, next) =>
  userController.deleteUser(req, res, next),
);

router.put("/:id/update", (req, res, next) =>
  userController.updateUser(req, res, next),
);

export default router;
