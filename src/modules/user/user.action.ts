// actions

import { UserType } from "../../types/types";
import { createCart } from "../cart/cart.model";
import { User } from "./user.model";

// GET: users/
export const getUsers =
  (): Promise<any> => User.find({});

// GET: users/:email
export async function getUserByEmail(email: string): Promise<any> {
  console.log('got mailed: ', email)
  const user = await User.findOne({ email });
  return user;
}

// GET: users/:token
export const getUserBySessionToken = (sessionToken: string) =>
  User.findOne({
    'authentication.sessionToken': sessionToken,
  })

// GET: users/:id
export const getUserById = (id: string) => User.findById(id)

// GET: users/cart
export const getUserCart = (id: string) => {
  return User.findOne({ id: id }, { cart: true });
}

// POST: users/
export const createUser = async ({
  username,
  email,
  role = 'user',
}: {
  username: string,
  email: string,
  role: string,
}): Promise<any> => {
  try {

    // create a cart
    const cart = await createCart({ orders: [], total: 0 });

    const user = await User.create({
      username,
      email,
      profile: {
        role: role,
        avatar: ''
      }
    })

    //user.profile.avatar = avatar
    if (user && user.profile)
      user.profile.role = 'user';

    user.cart = cart;
    return user.save();

    // convert model to object
    //.then((user) => user.toObject())
  } catch (err: any) {
    console.log('model:createUser/', err.message);
    return;
  }
}

// DELETE: users/:id
export const deleteUserById =
  async (id: string): Promise<any> => {
    try {
      // returns: a promise that resolves to: deleted User model 
      console.log(id)
      const user = await User.findOne({ _id: id });
      const isDeleted = await User.deleteMany({
        _id: id,
      });
      if (isDeleted) {
        console.log('user was deleted', isDeleted)
        return user;
      } else {
        console.log('user not deleted', isDeleted)
      }
      return isDeleted;
    } catch (err: any) {
      console.log(err.message);
    }
  }

// PATCH: users/:id
export const updateUserById =
  async (id: string, data: any): Promise<any> => {
    try {
      let user = await User.findOne({
        _id: id,
      })

      console.log('---update', user)
      if (!user) throw Error('user does not exist');

      if (data.username)
        user.username = data.username;
      if (data.role && user.profile && (data.role === 'user' || data.role === 'admin'))
        user.profile.role = data.role;
      return user.save()

    } catch (err: any) {
      console.log(err.message);
    }
  }
