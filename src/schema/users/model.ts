import { prop, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import mongoose from "mongoose";

@ObjectType()
export class User {
  @Field(() => String)
  @prop()
  _id?: mongoose.Types.ObjectId;

  @Field()
  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @Field()
  @prop()
  public firstName?: string;

  @Field()
  @prop()
  public lastName?: string;

  @Field()
  @prop()
  public emailAddress?: string;
}

export const UserModel = getModelForClass(User);
