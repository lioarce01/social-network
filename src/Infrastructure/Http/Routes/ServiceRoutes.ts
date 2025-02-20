import { setupContainer } from "../../DI/Container";
import express from "express";
import { ServiceController } from "../Controllers/Service";
import { container } from "tsyringe";
import { AuthMiddleware } from "../../Middlewares/auth";



setupContainer()

const router = express.Router()

const serviceController = container.resolve(ServiceController)
const auth = container.resolve(AuthMiddleware)

router.get("/", (req, res, next) => serviceController.getServices(req, res, next))
router.post("/",
    auth.authenticate(),
    auth.handleError,
    (req: any, res: any, next: any) => serviceController.createService(req, res, next))
router.get("/:id", (req, res, next) => serviceController.getServiceById(req, res, next))
router.put("/:id",
    auth.authenticate(),
    auth.handleError,
    (req: any, res: any, next: any) => serviceController.updateService(req, res, next))
router.delete("/:id",
    auth.authenticate(),
    auth.handleError,
    (req: any, res: any, next: any) => serviceController.deleteService(req, res, next)
)

export default router