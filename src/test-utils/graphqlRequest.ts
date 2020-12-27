import { ExecutionResult, graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

import buildSchema from "../schema/index";
import { User } from "../schema/users/model";

interface Options {
  source: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variableValues?: Maybe<{ [key: string]: any }>;
  currentUser?: User;
}

let schema: GraphQLSchema;

export const graphqlRequest = async ({
  source,
  variableValues,
  currentUser,
}: Options): Promise<ExecutionResult> => {
  if (!schema) {
    schema = await buildSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      currentUser: currentUser ?? null,
    },
  });
};
