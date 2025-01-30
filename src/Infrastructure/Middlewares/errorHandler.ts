import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../Shared/CustomError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    throw new CustomError("Invalid token or no token provided", 401);
  }

  res.status(500).json({ message: err.message || "Internal Server Error" });
};

export default errorHandler;
