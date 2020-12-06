import { ApolloServer, gql } from "apollo-server";

import { connect } from "./database";
import User from "./models/user";

connect();

const typeDefs = gql`
  type User {
    firstName: String!
    lastName: String!
    username: String!
    id: ID!
  }

  type Query {
    allUsers: [User!]!
  }
`;

const resolvers = {
  Query: {
    allUsers: () => User.find({}),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

void server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
