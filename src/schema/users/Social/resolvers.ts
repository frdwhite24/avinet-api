/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { UserResponse } from "../types";
import { MyContext } from "../../../types";
import { UserModel } from "../model";
import { isError } from "../../../utils/typeGuards";
import {
  missingUserError,
  notAuthorisedError,
} from "../../../utils/errorMessages";

@Resolver()
export class UserSocialResolvers {
  @Query(() => UserResponse)
  async getFollowers(@Ctx() { currentUser }: MyContext) {
    if (!currentUser) return notAuthorisedError();

    const user = await UserModel.find({
      username: currentUser.username,
    }).populate("followers");

    if (user.length === 0) return missingUserError();

    return {
      users: user[0].followers,
    };
  }

  @Query(() => UserResponse)
  async getFollowing(@Ctx() { currentUser }: MyContext) {
    if (!currentUser) return notAuthorisedError();

    const user = await UserModel.find({
      username: currentUser.username,
    }).populate("following");

    if (user.length === 0) return missingUserError();

    return {
      users: user[0].following,
    };
  }

  @Mutation(() => UserResponse)
  async followUser(
    @Arg("username") username: string,
    @Ctx() { currentUser }: MyContext
  ) {
    if (!currentUser) return notAuthorisedError();

    const userToFollow = await UserModel.find({
      username: username,
    });
    const userFollowing = await UserModel.find({
      username: currentUser.username,
    });

    if (userToFollow.length === 0 || userFollowing.length === 0)
      return missingUserError();

    if (
      userToFollow[0].followers?.find((follower) => {
        if (follower) {
          return follower.toString() === userFollowing[0]._id.toString();
        }
        return;
      })
    ) {
      return {
        errors: [
          {
            type: "user error",
            message: "Already following this user.",
          },
        ],
      };
    }

    userToFollow[0].followers?.push(userFollowing[0]._id);
    userFollowing[0].following?.push(userToFollow[0]._id);

    try {
      await userToFollow[0].save();
      await userFollowing[0].save();
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

    // This should be improved, it's a long standing issue with mongoose not
    // being able to repopulate a saved document and so an extra db query
    // must be carried out to send in the response
    // TODO: Find a better way to do this rather than carry out extra DB query
    const newUserFollowing = await UserModel.find({
      username: userFollowing[0].username,
    })
      .populate("following")
      .populate("followers");

    if (newUserFollowing.length === 0) return missingUserError();

    return {
      user: newUserFollowing[0],
    };
  }
}
