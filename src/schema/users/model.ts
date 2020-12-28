import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID, { nullable: true })
  _id!: mongoose.Types.ObjectId;

  @Field({ nullable: true })
  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true, minlength: 8 })
  public password!: string;

  @Field({ nullable: true })
  @prop()
  public firstName?: string;

  @Field({ nullable: true })
  @prop()
  public lastName?: string;

  @Field({ nullable: true })
  @prop()
  public emailAddress?: string;

  @Field(() => [User], { nullable: true })
  @prop({ ref: User, default: [] })
  public following!: Ref<User>[];

  @Field(() => [User], { nullable: true })
  @prop({ ref: User, default: [] })
  public followers!: Ref<User>[];
}

export const UserModel = getModelForClass(User);
