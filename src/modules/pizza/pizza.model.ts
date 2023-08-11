import mongoose, { Query } from "mongoose";
//import mongoosePaginate from 'mongoose-paginate-v2';

const schema = mongoose.Schema;

// moodel
const pizzaSchema = new schema({
  name: { type: String, unique: true },
  discription: { type: String, require: false },
  price: { type: Number, default: 0 },
  rating: { type: Number, require: false },
  image: { type: String, require: false },
  /* size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'small',
  } */
}, {
  timestamps: true,
})

// add pagination plugin
//pizzaSchema.plugin(mongoosePaginate);

export const Pizza = mongoose.model("Pizza", pizzaSchema)
