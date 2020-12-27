/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { hash, verify as passwordVerify } from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { sign } from "jsonwebtoken";

import { JWT_SECRET } from "../../../utils/config";
import { UserModel } from "../model";
import { UpdateUserInput, UsernamePasswordInput, UserResponse } from "../types";
import { MyContext } from "../../../types";
import { isError } from "../../../utils/typeGuards";

@Resolver()
export class UserRegisterResolver {
  @Query(() => UserResponse)
  async getAllUsers() {
    // TODO: Add auth which requires admin role to carry out this query
    return {
      users: await UserModel.find({})
        .populate("following")
        .populate("followers"),
    };
  }

  @Query(() => UserResponse)
  async getUser(@Arg("username") username: string) {
    // TODO: Add auth which requires admin role to carry out this query
    const user = await UserModel.find({ username: username })
      .populate("following")
      .populate("followers");
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
      if (isError(error)) {
        if (process.env.NODE_ENV !== "production") {
          return {
            errors: [{ type: "user error", message: error.message }],
          };
        } else {
          return {
            errors: [
              { type: "user error", message: "Could not create a user." },
            ],
          };
        }
      }
    }

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async deleteUser(
    @Arg("username") username: string,
    @Ctx() { currentUser }: MyContext
  ) {
    const userToDelete = await UserModel.find({ username: username });

    if (
      !currentUser ||
      userToDelete.length === 0 ||
      userToDelete[0].username !== currentUser.username
    ) {
      return {
        errors: [
          {
            type: "authorisation error",
            message: "Not authorised to carry out this action.",
          },
        ],
      };
    }

    try {
      await UserModel.findByIdAndDelete(userToDelete[0]._id);
    } catch (error) {
      if (isError(error)) {
        if (process.env.NODE_ENV !== "production") {
          return {
            errors: [{ type: "user error", message: error.message }],
          };
        } else {
          return {
            errors: [{ type: "user error", message: "Could not delete user." }],
          };
        }
      }
    }

    return {
      user: userToDelete[0],
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
      id: user[0]._id.toString(),
    };

    const token = sign(userForToken, JWT_SECRET);

    return { token };
  }

  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("options") options: UpdateUserInput,
    @Ctx() { currentUser }: MyContext
  ) {
    const userToUpdate = await UserModel.find({ username: options.username });

    if (
      !currentUser ||
      userToUpdate.length === 0 ||
      userToUpdate[0].username !== currentUser.username
    ) {
      return {
        errors: [
          {
            type: "authorisation error",
            message: "Not authorised to carry out this action.",
          },
        ],
      };
    }

    let updatedUser;
    try {
      updatedUser = await UserModel.findByIdAndUpdate(
        userToUpdate[0]._id,
        { ...options },
        { new: true }
      );
    } catch (error) {
      if (isError(error)) {
        if (process.env.NODE_ENV !== "production") {
          return {
            errors: [{ type: "user error", message: error.message }],
          };
        } else {
          return {
            errors: [
              {
                type: "user error",
                message: "Could not update user information.",
              },
            ],
          };
        }
      }
    }

    return {
      user: updatedUser,
    };
  }

  @Mutation(() => UserResponse)
  async updateUsername(
    @Arg("username") username: string,
    @Arg("newUsername") newUsername: string,
    @Ctx() { currentUser }: MyContext
  ) {
    const userToUpdate = await UserModel.find({ username });

    if (
      !currentUser ||
      userToUpdate.length === 0 ||
      userToUpdate[0].username !== currentUser.username
    ) {
      return {
        errors: [
          {
            type: "authorisation error",
            message: "Not authorised to carry out this action.",
          },
        ],
      };
    }

    userToUpdate[0].username = newUsername;

    try {
      await userToUpdate[0].save();
    } catch (error) {
      if (isError(error)) {
        if (process.env.NODE_ENV !== "production") {
          return {
            errors: [{ type: "user error", message: error.message }],
          };
        } else {
          return {
            errors: [
              {
                type: "user error",
                message: "Could not update username.",
              },
            ],
          };
        }
      }
    }

    const userForToken = {
      username: userToUpdate[0].username,
      id: userToUpdate[0]._id.toString(),
    };

    const token = sign(userForToken, JWT_SECRET);

    return { token, user: userToUpdate[0] };
  }

  @Mutation(() => UserResponse)
  async updatePassword(
    @Arg("password") currentPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { currentUser }: MyContext
  ) {
    if (!currentUser) {
      return {
        errors: [
          {
            type: "authorisation error",
            message: "Not authorised to carry out this action.",
          },
        ],
      };
    }

    const userToUpdate = await UserModel.find({
      username: currentUser.username,
    });

    if (userToUpdate.length === 0) {
      return {
        errors: [
          {
            type: "authorisation error",
            message: "Invalid token provided.",
          },
        ],
      };
    }

    const valid = await passwordVerify(
      userToUpdate[0].password,
      currentPassword
    );

    if (!valid) {
      return {
        errors: [
          {
            type: "password error",
            message: "Incorrect current password provided.",
          },
        ],
      };
    }

    if (newPassword.length < 8) {
      return {
        errors: [
          {
            type: "password error",
            message:
              "New password length is too short, minimum length is 8 chars.",
          },
        ],
      };
    }

    const hashedPassword = await hash(newPassword);

    let updatedUser;
    try {
      updatedUser = await UserModel.findByIdAndUpdate(
        userToUpdate[0]._id,
        { password: hashedPassword },
        { new: true }
      );
    } catch (error) {
      if (isError(error)) {
        if (process.env.NODE_ENV !== "production") {
          return {
            errors: [{ type: "user error", message: error.message }],
          };
        } else {
          return {
            errors: [
              {
                type: "user error",
                message: "Could not update username.",
              },
            ],
          };
        }
      }
    }

    if (!updatedUser) {
      return {
        errors: [{ type: "user error", message: "Could not update username." }],
      };
    }

    return { user: updatedUser };
  }
}
