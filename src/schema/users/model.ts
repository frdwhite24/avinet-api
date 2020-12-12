import { prop, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class UserClass {
  @Field()
  @prop()
  public firstName?: string;

  @Field()
  @prop()
  public lastName?: string;

  @Field()
  @prop()
  public username?: string;

  @Field()
  @prop({ required: true })
  public emailAddress!: string;

  // @prop({required: true})
  // public password!: string;
}

export const User = getModelForClass(UserClass);
