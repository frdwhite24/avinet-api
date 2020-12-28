/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { hash, verify as passwordVerify } from "argon2";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { sign } from "jsonwebtoken";

import { JWT_SECRET } from "../../../utils/config";
import { UserModel } from "../model";
import { UpdateUserInput, UsernamePasswordInput, UserResponse } from "../types";
import { MyContext } from "../../../types";
import { isError } from "../../../utils/typeGuards";
import {
  existingUserError,
  incorrectPasswordError,
  missingUserError,
  notAuthorisedError,
} from "../../../utils/errorMessages";

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
    const user = await UserModel.findOne({ username: username })
      .populate("following")
      .populate("followers");
    if (!user) return missingUserError();
    return {
      user,
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
    const currentUser = await UserModel.findOne({ username: options.username });
    if (currentUser) return existingUserError();

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
    if (!currentUser) return notAuthorisedError();

    const userToDelete = await UserModel.findOne({ username: username });
    if (!userToDelete) return missingUserError();

    if (userToDelete.username !== currentUser.username)
      return notAuthorisedError();

    try {
      await UserModel.findByIdAndDelete(userToDelete._id);
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
      user: userToDelete,
    };
  }

  @Mutation(() => UserResponse)
  async loginUser(@Arg("options") options: UsernamePasswordInput) {
    const user = await UserModel.findOne({ username: options.username });
    if (!user) return missingUserError();

    const valid = await passwordVerify(user.password, options.password);
    if (!valid) return incorrectPasswordError();

    const userForToken = {
      username: user.username,
      id: user._id.toString(),
    };

    const token = sign(userForToken, JWT_SECRET);

    return { token };
  }

  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("options") options: UpdateUserInput,
    @Ctx() { currentUser }: MyContext
  ) {
    if (!currentUser) return notAuthorisedError();
    const userToUpdate = await UserModel.findOne({
      username: options.username,
    });

    if (!userToUpdate || userToUpdate.username !== currentUser.username)
      return notAuthorisedError();

    let updatedUser;
    try {
      updatedUser = await UserModel.findByIdAndUpdate(
        userToUpdate._id,
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
    if (!currentUser) return notAuthorisedError();

    const userToUpdate = await UserModel.findOne({ username });
    if (!userToUpdate) return missingUserError();

    if (userToUpdate.username !== currentUser.username)
      return notAuthorisedError();

    userToUpdate.username = newUsername;

    try {
      await userToUpdate.save();
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
      username: userToUpdate.username,
      id: userToUpdate._id.toString(),
    };

    const token = sign(userForToken, JWT_SECRET);

    return { token, user: userToUpdate };
  }

  @Mutation(() => UserResponse)
  async updatePassword(
    @Arg("password") currentPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { currentUser }: MyContext
  ) {
    if (!currentUser) return notAuthorisedError();

    const userToUpdate = await UserModel.findOne({
      username: currentUser.username,
    });
    if (!userToUpdate) return missingUserError();

    const valid = await passwordVerify(userToUpdate.password, currentPassword);
    if (!valid) return incorrectPasswordError();

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
        userToUpdate._id,
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
