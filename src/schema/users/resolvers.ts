/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { hash, verify as passwordVerify } from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { sign } from "jsonwebtoken";

import { JWT_SECRET } from "../../utils/config";
import { UserModel, User } from "./model";
import { MyContext } from "../../types";

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@ObjectType()
class UserError {
  @Field()
  type!: string;
  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [UserError], { nullable: true })
  errors?: Error[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => String, { nullable: true })
  token?: string;
}

@Resolver()
export class UserResolver {
  @Query(() => UserResponse)
  async getAllUsers() {
    return {
      users: await UserModel.find({}),
    };
  }

  @Query(() => UserResponse)
  async getUser(@Arg("username") username: string) {
    const user = await UserModel.find({ username: username });
    if (user.length === 0) {
      return {
        errors: [
          {
            type: "No user",
            message: "That username doesn't exist.",
          },
        ],
      };
    }
    return {
      user: user[0],
    };
  }

  @Query(() => UserResponse)
  whoAmI(@Ctx() { currentUser }: MyContext) {
    return currentUser
      ? { user: currentUser }
      : {
          errors: [{ type: "user error", message: "No valid token provided." }],
        };
  }

  @Mutation(() => UserResponse)
  async createUser(@Arg("options") options: UsernamePasswordInput) {
    const currentUser = await UserModel.find({ username: options.username });

    if (currentUser.length !== 0) {
      return {
        errors: [
          { type: "user error", message: "That username already exists." },
        ],
      };
    }

    if (options.password.length < 8) {
      return {
        errors: [
          {
            type: "password error",
            message: "Password length is too short, minimum length is 8 chars.",
          },
        ],
      };
    }

    const hashedPassword = await hash(options.password);
    const user = new UserModel({
      username: options.username,
      password: hashedPassword,
    });

    try {
      await user.save();
    } catch (error) {
      return {
        errors: [{ type: "user error", message: "Could not create a user." }],
      };
    }

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async loginUser(@Arg("options") options: UsernamePasswordInput) {
    const user = await UserModel.find({ username: options.username });
    if (user.length === 0) {
      return {
        errors: [
          {
            type: "user error",
            message: "That username doesn't exist.",
          },
        ],
      };
    }
    const valid = await passwordVerify(user[0].password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            type: "password error",
            message: "Incorrect password.",
          },
        ],
      };
    }

    const userForToken = {
      username: user[0].username,
      id: user[0]._id,
    };

    const token = sign(userForToken, JWT_SECRET);

    return { token, user: user[0] };
  }
}
