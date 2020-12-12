import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./users/resolvers";

export default async (): Promise<GraphQLSchema> =>
  await buildSchema({ resolvers: [UserResolver] });
