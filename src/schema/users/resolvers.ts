/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { hash, verify } from "argon2";
import { UserModel, User } from "./model";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import { JWT_SECRET } from "../../utils/config";
import { sign } from "jsonwebtoken";

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
  name!: string;
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
            name: "No user",
            message: "That username doesn't exist.",
          },
        ],
      };
    }
    return {
      user: user[0],
    };
  }

  @Mutation(() => UserResponse)
  async createUser(@Arg("options") options: UsernamePasswordInput) {
    const currentUser = await UserModel.find({ username: options.username });

    if (currentUser.length !== 0) {
      return {
        errors: [
          { name: "Create user", message: "That username already exists." },
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
        errors: [{ name: "Create user", message: "Could not create a user." }],
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
            name: "No user",
            message: "That username doesn't exist.",
          },
        ],
      };
    }
    const valid = await verify(user[0].password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            name: "Password",
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
