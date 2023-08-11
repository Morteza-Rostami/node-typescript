import { Ref, getModelForClass, prop } from "@typegoose/typegoose"
import { User, UserModel } from "../user/user.model";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz');

export class Video {

  @prop({ required: false })
  public title: string;

  @prop({ reequired: false })
  public description: string;

  @prop({ enum: ['mp4'], required: false })
  public extension: string;

  // pizze has one video:
  //@prop({ required: true, ref: () => User })
  //public owner: Ref<User>

  @prop({ unique: true, default: () => nanoid() })
  public videoId: string

  // video is published or not
  @prop({ default: false })
  public published: boolean
}

export const VideoModel = getModelForClass(Video, {
  schemaOptions: {
    timestamps: true,
  }
})