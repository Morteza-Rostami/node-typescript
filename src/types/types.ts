import { ObjectId } from "mongoose";

// User model
export type UserType = {
  _id: ObjectId,
  username: string;
  email: string;
  lastLink: Date;
  profile?: {
    role: string;
    avatar?: string,
    address?: string,
  }
}