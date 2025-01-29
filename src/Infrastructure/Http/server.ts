import "reflect-metadata";
import express from "express";
import cors from "cors";
import router from "../Http/Routes/index";
import errorHandler from "../Middlewares/errorHandler";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use("/", router);

app.use(errorHandler);

export { app };
