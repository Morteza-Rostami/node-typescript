import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

// validation middleware
export const runValidation =
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    // if there are errors
    if (!errors.isEmpty()) {
      const err = { err: errors.array()[0].msg };
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(err);
    }

    next();
  }