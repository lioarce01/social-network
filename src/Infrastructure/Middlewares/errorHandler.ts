import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: err.message || "Internal Server Error" });
};

export default errorHandler;
