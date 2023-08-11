import mongoose, { Query } from "mongoose";
import { UserModel } from "../user/user.model";
import { PizzaModel } from "../pizza/pizza.model";
import { DrinkModel } from "../drink/drink.model";

const schema = mongoose.Schema;

// type
/* type Order = {
  user: any,
  pizzas: [any],
  drinks: [any],
  total: number,
  address: string
} */

// moodel
const orderSchema = new schema({

  total: Number,
  address: String,

  //@rel
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'UserModel',
  },

  //@rel
  pizza: {
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'small',
    },
    pizza: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'PizzaModel',
    }
  },

  //@rel
  drinks: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'DrinkModel',
  }],
}, {
  timestamps: true,
})


// actions:
//===========

// GET: Order/
const getOrder =
  (): Query<any[] | null, any> => OrderModel.find({});

// GET: Order/:id
const getPizza =
  (id: string):
    Query<any | null, any> => OrderModel.findOne({ id: id });

// POST: Order/
const createOrder = ({
  user,
  total,
  address,
  pizzas,
  drinks,
}: {
  user: string,
  total: number,
  address: string,
  pizzas: any[],
  drinks: any[],
}): Promise<any> => {

  // .create() : does .save() too
  const order: Promise<any> = OrderModel.create({
    user,
    total,
    address,
    pizzas,
    drinks,
  })

  return order;
}

// PATCH: Order/:id
const updatePizza = ({

}: any) => {
  return OrderModel.updateOne({})
}

// DELETE: Order/:id
const deleteOrder = (id: string) => OrderModel.deleteOne({ id: id });


export const OrderModel = mongoose.model("Order", orderSchema)
