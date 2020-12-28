/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { UserResponse } from "../types";
import { MyContext } from "../../../types";
import { isError } from "../../../utils/typeGuards";
import {
  alreadyFollowingError,
  missingUserError,
  mutationFailedError,
  notAuthorisedError,
} from "../../../utils/errorMessages";
import { getUser } from "../services";

@Resolver()
export class UserSocialResolvers {
  @Query(() => UserResponse)
  async getFollowers(@Ctx() { currentUser }: MyContext) {
    if (!currentUser) return notAuthorisedError();

    const user = await getUser(currentUser.username);
    if (!user) return missingUserError();

    return {
      users: user.followers,
    };
  }

  @Query(() => UserResponse)
  async getFollowing(@Ctx() { currentUser }: MyContext) {
    if (!currentUser) return notAuthorisedError();

    const user = await getUser(currentUser.username);
    if (!user) return missingUserError();

    return {
      users: user.following,
    };
  }

  @Mutation(() => UserResponse)
  async followUser(
    @Arg("username") username: string,
    @Ctx() { currentUser }: MyContext
  ) {
    if (!currentUser) return notAuthorisedError();

    const userToFollow = await getUser(username);
    if (!userToFollow) return missingUserError();

    if (
      userToFollow.followers?.find((follower) => {
        if (follower) {
          return follower.toString() === currentUser._id.toString();
        }
        return;
      })
    )
      return alreadyFollowingError();

    userToFollow.followers?.push(currentUser._id);
    currentUser.following?.push(userToFollow._id);

    try {
      await userToFollow.save();
      await currentUser.save();
    } catch (error) {
      if (isError(error)) {
        if (process.env.NODE_ENV !== "production") {
          return {
            errors: [{ type: "user error", message: error.message }],
          };
        } else {
          return mutationFailedError("user");
        }
      }
    }

    // This should be improved, it's a long standing issue with mongoose not
    // being able to repopulate a saved document and so an extra db query
    // must be carried out to send in the response
    // TODO: Find a better way to do this rather than carry out extra DB query
    const newUserFollowing = await getUser(currentUser.username);
    if (!newUserFollowing) return missingUserError();

    return {
      user: newUserFollowing,
    };
  }
}
