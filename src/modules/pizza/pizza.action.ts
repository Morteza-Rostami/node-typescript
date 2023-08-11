// actions:
//===========
//import mongoosePaginate from 'mongoose-paginate-v2';
import { Query } from "mongoose";
import { Pizza } from "./pizza.model";

// GET: pizzas/
export const getPizzas = () => {
  return Pizza.find({})
  //return pizzas;
}

// GET: pizzas/:id
export const getPizza =
  (id: string):
    Query<any | null, any> => Pizza.findOne({ id: id });

// GET: api/pizzas?term=""
export const searchPizza = async (term: string): Promise<any> => {
  const user = await Pizza.find({})
  return user;
}

// POST: pizzas/
export const createPizza = async ({
  name,
  description,
  price,
  rating,
  image,
}: {
  name: string,
  description: string,
  price: number,
  rating: number,
  image: string,
}): Promise<any> => {

  // .create() : does .save() too
  const pizza: any = await Pizza.create({
    name: name,
    discription: description,
    price: price,
    rating: rating,
    image: image,
  })

  return pizza;
}

// PATCH: pizzas/:id
export const updatePizza = ({
  name,
  price,
  rating,
}: {
  name: string,
  price: number,
  rating: number,
}) => {
  return Pizza.updateOne({})
}

// DELETE: pizzas/:id
export const deletePizza = (id: string) => Pizza.deleteOne({ id: id });