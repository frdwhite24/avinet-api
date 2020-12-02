import { ApolloServer, gql } from "apollo-server";
import { connect } from "mongoose";

import { MONGODB_URI } from "./utils/config";
import User from "./models/user";

console.log("Connecting to", MONGODB_URI);

void connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log("Error connecting to MongoDB", error.message);
  });

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
