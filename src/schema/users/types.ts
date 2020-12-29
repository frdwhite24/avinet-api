import { Field, InputType, ObjectType } from "type-graphql/dist/decorators";
import { ResponseError } from "../types";

import { User } from "./model";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  emailAddress?: string;
  @Field({ nullable: true })
  firstName?: string;
  @Field({ nullable: true })
  lastName?: string;
}

@InputType()
export class UsernamePasswordInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [ResponseError], { nullable: true })
  errors?: Error[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => String, { nullable: true })
  token?: string;
}
