/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { UserResponse } from "../types";
import { MyContext } from "../../../types";
import { UserModel } from "../model";

@Resolver()
export class UserSocialResolvers {
  @Mutation(() => UserResponse)
  async followUser(
    @Arg("username") username: string,
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

    const userToFollow = await UserModel.find({
      username: username,
    });

    if (userToFollow.length === 0) {
      return {
        errors: [
          {
            type: "user error",
            message: "Username doesn't exist.",
          },
        ],
      };
    }

    return { user: userToFollow[0] };
  }
}
