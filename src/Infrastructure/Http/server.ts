import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import router from "../Http/Routes/index";
import { initSocketServer } from "../Websocket/SocketServer";
import errorHandler from "../Middlewares/errorHandler";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());

// const httpServer = createServer(app);

// const io = initSocketServer(httpServer);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use("/", router);

// app.locals.io = io;

app.use(errorHandler);

export { app };
