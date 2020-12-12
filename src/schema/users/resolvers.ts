/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { User, UserClass } from "./model";
import { Query, Resolver } from "type-graphql";

@Resolver(User)
export class UserResolver {
  @Query(() => Number)
  getNumber() {
    return 1;
  }

  @Query(() => [UserClass])
  async users() {
    return await User.find({});
  }
}
