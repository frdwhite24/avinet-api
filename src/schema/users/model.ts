import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import mongoose from "mongoose";

@ObjectType()
export class User {
  @Field(() => String)
  _id?: mongoose.Types.ObjectId;

  @Field()
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
  @prop({ ref: User })
  public following?: Ref<User>[];

  @Field(() => [User], { nullable: true })
  @prop({ ref: User })
  public followers?: Ref<User>[];
}

export const UserModel = getModelForClass(User);
