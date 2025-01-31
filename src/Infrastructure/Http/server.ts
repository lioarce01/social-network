import "reflect-metadata";
import express from "express";
import cors from "cors";
import router from "../Http/Routes/index";
import errorHandler from "../Middlewares/errorHandler";
import { AuthMiddleware } from "../Middlewares/auth";
import { container } from "tsyringe";
import helmet from "helmet";
import { apiLimiter } from "../../Shared/Limiter";

const authMiddleware = container.resolve(AuthMiddleware);

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    code: 200,
    status: "OK",
    message: "Server is running",
  });
});

app.use(apiLimiter);

app.use("/", router);

app.use(errorHandler);
app.use(authMiddleware.handleError);

export { app };
