import { NextFunction, Request, Response } from "express";
import { JWT_TOKEN_NAME } from "../constants/const";
import { verifyJwt } from "../modules/auth/auth.utils";

// get the cookie and return a user object
function deserializeUser(req: Request, res: Response, next: NextFunction) {

  // get jwt out of cookie
  const jwtToken =
    (req.headers.authorization || req.cookies[JWT_TOKEN_NAME] || '')
      .replace(/^Bearer\s/, '')

  if (!jwtToken) {
    return next();
  }

  const decoded = verifyJwt(jwtToken);

  if (decoded) {
    // set the user object on res object
    res.locals.user = decoded;
  }

  return next();
}

export default deserializeUser