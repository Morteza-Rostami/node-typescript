import express from 'express'
import { loginController, signoutController, signupController, verifyController } from './auth.controller'

// validator middleware
import { runValidation } from '../../middleware/validator/main.valid';
import { loginValidator, signupValidator } from '../../middleware/validator/auth.valid';

const router = express.Router()

// api/auth/login
router
  .route('/login')
  .post(
    loginValidator,
    runValidation,
    loginController);

// api/auth/verify
router.get('/verify', verifyController);

// api/users/signup
router
  .route('/signup')
  .post(
    signupValidator,
    runValidation,
    signupController)

// api/users/signout
router
  .route('/signout')
  .get(signoutController)

export default router