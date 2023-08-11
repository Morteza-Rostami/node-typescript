import express from 'express'
import { processRequestBody } from 'zod-express-middleware'
import { signupSchema } from './user.schema'
import guardUser from '../../middleware/guard/guardUser'

const router = express.Router()

// route for getting authUser: 
// we send token: and get user back
// api/users
router.get('/',
  // middleware_guard: authUser
  guardUser,
  (req, res) => {
    return res.json({
      msg: 'get auth user',
      err: 0,
      data: res.locals.user,
    })
  })

export default router