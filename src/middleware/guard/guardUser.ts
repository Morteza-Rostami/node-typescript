import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// after deserialize: call this
function guardUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user) {
    return res.status(StatusCodes.FORBIDDEN).json({
      msg: 'not authorized route',
      err: 1
    })
  }

  // if there is a valid token and user: go to controller
  return next();
}

export default guardUser