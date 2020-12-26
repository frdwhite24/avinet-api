import { ExecutionResult, graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

import buildSchema from "../schema/index";

interface Options {
  source: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variableValues?: Maybe<{ [key: string]: any }>;
}

let schema: GraphQLSchema;

export const graphqlRequest = async ({
  source,
  variableValues,
}: Options): Promise<ExecutionResult> => {
  if (!schema) {
    schema = await buildSchema();
  }
  return graphql({
    schema,
    source,
    variableValues,
  });
};
