import mongoose, { Query } from "mongoose";

const schema = mongoose.Schema;

// type
/* type Drink = {
  name: string,
  price: number,
  image: string,
} */

// moodel
const drinkSchema = new schema({
  name: { type: String, unique: true },
  price: { type: Number, default: 0 },
  image: { type: String, require: false },
}, {
  timestamps: true,
})

// actions:
//===========

// GET: pizzas/
const getPizzas =
  (): Query<any[] | null, any> => DrinkModel.find({});

// GET: Drinks/:id
const getDrink =
  (id: string):
    Query<any | null, any> => DrinkModel.findOne({ id: id });

// POST: pizzas/
const createPizza = ({
  name,
  price,
  image,
}: {
  name: string,
  price: number,
  image: string,
}): Promise<any> => {

  // .create() : does .save() too
  const drink: Promise<any> = DrinkModel.create({
    name,
    price,
    image,
  })

  return drink;
}

// PATCH: pizzas/:id
const updatePizza = ({
  name,
  price,
}: any) => {
  return DrinkModel.updateOne({})
}

// DELETE: pizzas/:id
const deletePizza = (id: string) => DrinkModel.deleteOne({ id: id });

export const DrinkModel = mongoose.model("Drink", drinkSchema)
