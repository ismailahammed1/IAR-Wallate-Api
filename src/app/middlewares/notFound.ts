import { Request, Response, NextFunction } from "express";
import { AppError } from "../errorHelpers/AppError";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
};

export default notFound;
