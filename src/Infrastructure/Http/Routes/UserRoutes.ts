import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { UserController } from "../Controllers/User";
import { setupContainer } from "../../DI/Container";

setupContainer();

const router = express.Router();

const userController = container.resolve(UserController);

router.get("/", (req, res, next) => userController.getAllUsers(req, res, next));
router.post("/", (req, res, next) => userController.createUser(req, res, next));
router.get("/:id", (req, res, next) =>
  userController.getUserById(req, res, next),
);
router.put("/:id/update", (req, res, next) =>
  userController.updateUser(req, res, next),
);
router.delete("/:id", (req, res, next) =>
  userController.deleteUser(req, res, next),
);
router.put("/:id/disable", (req, res, next) =>
  userController.disableUser(req, res, next),
);
router.put("/:id/switchRole", (req, res, next) =>
  userController.switchUserRole(req, res, next),
);

export default router;
