import express from 'express'
import guardAdmin from '../../middleware/guard/guardAdmin'
//import { processRequestBody } from 'zod-express-middleware'

const router = express.Router()

// route for getting authUser: 
// we send token: and get user back
// api/users
router.get('/',
  // middleware_guard: authUser
  guardAdmin,
  (req, res) => {
    return res.json({
      msg: 'admin dashboard/',
      err: 0,
      data: res.locals.user,
    })
  })

export default router