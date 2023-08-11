import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { generateJwtToken, sendMagicLink, verifyJwt } from "./auth.utils";
import { JWT_TOKEN_NAME, ROLES } from "../../constants/const";
import { JwtPayload } from "jsonwebtoken";
import { createUser, getUserByEmail } from "../user/user.action";

type Decoded = {
  _id: string,
  username: string,
  email: string,
  createdAt: Date,
  updatedAt: Date,
  __v: number,
  iat: number,
  exp: number
}

//~~~~~~~~~~~~~~~~===(((())))******* SIGN UP

// POST: api/auth/signup
export async function signupController(req: Request, res: Response) {

  const { username, email } = req.body

  // errors
  const errUserExist = { msg: 'user exist', err: 1 };
  const errUserCreate = { msg: 'user create failed', err: 1 };

  try {

    const oldUser = await getUserByEmail(email);
    if (oldUser) return res.status(StatusCodes.BAD_REQUEST).json(errUserExist);

    // create user
    // if try inserting a user with email already exist: mongodb throws: 11000 error
    const user = createUser({
      username: username,
      email: email,
      role: ROLES.user,
    });

    if (!user) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errUserCreate);

    // 201: resource was created
    const success = { msg: 'user was created', err: 0 };
    return res.status(StatusCodes.CREATED).json(success);

  } catch (err: any) {
    // if user exist
    /* if (err.code === 11000) {
      return res.status(StatusCodes.CONFLICT).send('user already exist')
    } */

    // other arror
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
  }

}

//~~~~~~~~~~~~~~~~===(((())))******* LOG IN

// api/auth/login
export async function loginController(req: Request, res: Response) {
  const { email } = req.body;

  const errUserExist = { msg: 'invalid email', err: 1 }

  try {

    // get user by email
    const user = await getUserByEmail(email);

    // check if user exist: throw error
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json(errUserExist);
    }

    // jwt payload
    const payload = user.toJSON();

    // generate a jwt token
    const token = generateJwtToken(payload);

    // send a magic link email
    await sendMagicLink(email, token);

    // response
    const success = { msg: 'link was sent to your email', err: 0 }
    return res.status(StatusCodes.CREATED).json(success);

  } catch (err) {
    return res.status(400).json({
      msg: 'login failed',
      err: 1
    })
  }
}

//~~~~~~~~~~~~~~~~===(((())))******* VERI FY

// api/auth/verify
export async function verifyController(req: Request, res: Response) {
  const { token } = req.query;

  const errNoToken = { msg: 'token is required', err: 1 };
  const errWrongToken = { msg: 'wrong token', err: 1 };
  const errUserExist = { msg: 'user not exist', err: 1 };

  if (!token) return res.status(StatusCodes.BAD_REQUEST).json(errNoToken);

  try {
    // check if there is a token
    if (!token) {
      return res.status(400).json({
        msg: 'token is missing!',
        err: 1
      })
    }

    // verify token
    const decoded: any = verifyJwt(token);

    // error: if bad token
    if (!decoded) return res.status(400).json(errWrongToken);

    // store token in http only cookie
    res.cookie(
      JWT_TOKEN_NAME,
      token,
      {

        // 1 year 3.154e10,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // not accesible through js, only returns via http
        httpOnly: true,
        domain: process.env.DOMAIN || 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: process.env.MODE_ENV === 'production' ? true : false,
      },
    );

    // get auth user
    let user = await getUserByEmail(decoded.email);

    if (!user) return res.status(StatusCodes.BAD_REQUEST).json(errUserExist);

    // response with auth user
    const { _id, username, email, profile } = user;
    const success = {
      msg: 'user is logged in',
      err: 0,
      data: { _id, username, email, profile },
    }
    return res.status(StatusCodes.CREATED).json(success);

  } catch (err: any) {
    return res.status(400).json({
      msg: 'can\'t verify this user!',
      err: err.message,
      stack: err.stack,
    })
  }
}

//~~~~~~~~~~~~~~~~===(((())))******* signout

export async function signoutController(req: Request, res: Response, next: NextFunction) {
  try {
    // clear the cookie
    res.clearCookie(JWT_TOKEN_NAME);
    const success = { msg: 'signout success', err: 0 };
    return res.json(success);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ msg: '/signout failed', err: 1 });
  }
}

