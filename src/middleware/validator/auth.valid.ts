import { check } from 'express-validator'

// api/auth/signup
export const signupValidator = [
  check('username')
    .not()
    .isEmpty()
    .withMessage('username is required'),

  check("email")
    .isEmail()
    .withMessage('email is required')

  /* 
  check('password')
    .isLength({min: 6})
    .withMessage('password must be at least 6 chars')
  */
]

// api/auth/login
export const loginValidator = [
  check("email")
    .isEmail()
    .withMessage('email is required'),
]