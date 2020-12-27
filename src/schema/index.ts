import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { UserRegisterResolver } from "./users/Register/resolvers";
import { UserSocialResolvers } from "./users/Social/resolvers";

export default async (): Promise<GraphQLSchema> =>
  await buildSchema({
    resolvers: [UserRegisterResolver, UserSocialResolvers],
    validate: false,
  });
