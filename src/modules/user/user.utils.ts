import { NextFunction } from "express";
import { CartModel } from "../cart/cart.model";

// delete user.cart
export async function deleteUserCart(model: any, goNext: NextFunction): Promise<any> {
  const user: any = model.getQuery();

  console.log('**********--deleteMany: ', user._id, user.cart, user);

  const cart = await CartModel.deleteOne({ id: user.cart });
  if (cart) {
    console.log('cart was deleted')
  } else {
    console.log('cart was not deleted')
  }
  goNext();
}