import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 30 minutes",
  headers: true,
  skip: (req) => req.ip === "127.0.0.1",
});
