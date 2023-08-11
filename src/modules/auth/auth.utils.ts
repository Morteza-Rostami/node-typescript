import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'something';
const EXPIRES_IN = process.env.EXPIRES_IN || '7d';

// @args: a user
// @return: a token with user payload
export const generateJwtToken = (payload: any): string => {
  const token = jwt.sign(
    // payload to store in token
    payload,
    // secret
    JWT_SECRET,
    //options
    {
      expiresIn: EXPIRES_IN,
    },
  )

  return token;
}

// verify the jwt token
export function verifyJwt(token: any) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err: any) {
    // if it throws error: return null
    return null;
  }
}

// @args: uesr.email, token
export const sendMagicLink = (email: string, token: string): void => {
  // magic link:
  const magicLink =
    `<a href='http://localhost:8080/api/auth/verify?token=${token}'>Login to Pizza Shop</a>`
  /* 
  to: 
  from:
  subject
  html
  */
  console.log('-------magic-link: ', magicLink);
}