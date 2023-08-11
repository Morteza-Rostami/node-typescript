
import { object, string, TypeOf } from 'zod'

// define type
export const signupSchema = {
  // Request.body, Request.query and so on: 
  body: object({
    // without saying optional : is required
    username: string({
      required_error: 'username is required',
    }),
    email: string({
      required_error: 'email is required',
    })
      .email('email must be valid'),
  })
}

export type SignupBody = TypeOf<typeof signupSchema.body>