import "reflect-metadata";
import { app } from "./Infrastructure/Http/server";
import { appConfig } from "./config/config";

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
