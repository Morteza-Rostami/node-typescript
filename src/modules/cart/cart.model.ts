import mongoose, { Query } from "mongoose";
import { User } from "../user/user.model";
import { Schema, Document } from 'mongoose'
import { OrderModel } from "../order/order.model";

interface ICart {

}

interface ICartDocument extends ICart, Document { }

const schema = mongoose.Schema;

// type
/* type Cart = {
  name: string,
  price: number,
  rating: number,
} */

// moodel
//const CartSchema: Schema<any> = new schema({
const CartSchema: any = new schema({

  //@rel
  /* user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  }, */

  //@rel
  orders: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'OrderModel',
    require: false,
  }],

  total: { type: Number, require: false },
}, {
  timestamps: true,
})


// actions:
//===========

// GET: pizzas/:id
export const getCart =
  (id: string):
    Query<any | null, any> => CartModel.findOne({ id: id });

// POST: pizzas/
export const createCart = ({
  orders,
  total,
}: {
  orders: any[],
  total: number
}): Promise<any> => {

  // .create() : does .save() too
  const order: Promise<any> = CartModel.create({})

  return order;
}

// PATCH: pizzas/:id
export const updateCart = ({
  name,
  price,
  rating,
}: any) => {
  return CartModel.updateOne({})
}

// DELETE: pizzas/:id
export const deleteCart = (id: string) => CartModel.deleteOne({ id: id });


export const CartModel: any = mongoose.model("Cart", CartSchema)
