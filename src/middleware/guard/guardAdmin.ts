import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ROLES } from "../../constants/const";

// after deserialize: call this
function guardAdmin(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  const errNoUser = {
    msg: 'not authorized admin route',
    err: 1
  };
  const errNotAdmin = {
    msg: 'not an admin',
    err: 1,
  };

  if (!user) {
    return res.status(StatusCodes.FORBIDDEN).json(errNoUser);
  }

  if (user.profile.role !== ROLES.admin) {
    return res.status(StatusCodes.FORBIDDEN).json(errNotAdmin);
  }

  // if there is a valid token and user: go to controller
  return next();
}

export default guardAdmin