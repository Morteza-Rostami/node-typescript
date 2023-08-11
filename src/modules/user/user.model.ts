import mongoose, { Query } from "mongoose";
import { getModelForClass, prop, pre } from "@typegoose/typegoose"
import { Date } from "mongoose"
import { CartModel, createCart } from "../cart/cart.model";
import { deleteUserCart } from "./user.utils";

const profileSchema = new mongoose.Schema({
  //_id: { type: mongoose.Schema.Types.ObjectId, autoIncrement: true },
  //avatar: { type: String },

  // store photo in binary format
  avatar: {
    data: Buffer,
    contentType: String,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // nested schema
  address: {
    full: String,
    city: String,
  },
})

export const userSchema = new mongoose.Schema({
  //_id: { type: mongoose.Schema.Types.ObjectId, autoIncrement: true },
  username: {
    type: String,
    required: true,
    trim: true,
    max: 32,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  lastLink: {
    type: Date,
    default: () => Date.now(),
    select: false,
  },

  // enbeded schema:
  profile: profileSchema,

  //@rel
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'CartModel',
  },

  // password
  /* hashed_password: {
    type: String,
    required: true,
  },
  salt :String, 
  resetPasswordLink: {
    data: String,
    default: '',
  }
  */

}, {
  timestamps: true,
})

//~~~~~~~~~~~~~~~~===(((())))******* Middlewares

// vitual password
/* userSchema  
  .virtual('password')
  .set()
  .get()
 */

// methods:
/* 
userSchema.methods = {
  encryptPassword: function() {
  }
} */

userSchema.pre('save', async function (next: any) {
  console.log('saved: ');
  next();
})

userSchema.pre('deleteMany', async function (next: any) {
  deleteUserCart(this, next);
});

userSchema.pre('deleteOne', async function (next: any) {
  deleteUserCart(this, next);
});

userSchema.pre(
  'findOneAndDelete',
  { document: true },
  async function (next: any) {
    deleteUserCart(this, next);
  });

//~~~~~~~~~~~~~~~~===(((())))******* END

export const User = mongoose.model('User', userSchema);
