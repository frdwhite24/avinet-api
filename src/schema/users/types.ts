import { Field, InputType, ObjectType } from "type-graphql/dist/decorators";

import { User } from "./model";

@InputType()
export class UpdateUserInput {
  @Field()
  username!: string;
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
export class UserError {
  @Field()
  type!: string;
  @Field()
  message!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [UserError], { nullable: true })
  errors?: Error[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => String, { nullable: true })
  token?: string;
}
