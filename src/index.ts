import express from "express";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { verify } from "jsonwebtoken";

import { connect } from "./database";
import { JWT_SECRET, PORT } from "./utils/config";
import buildSchema from "./schema/index";
import { UserModel } from "./schema/users/model";
import { MyToken } from "./types";

const main = async () => {
  await connect();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema(),
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;

      const decodedToken =
        auth && auth.toLowerCase().startsWith("bearer ")
          ? (verify(auth.substring(7), JWT_SECRET) as MyToken)
          : null;

      const currentUser = decodedToken
        ? await UserModel.findById(decodedToken.id)
        : null;

      return { currentUser };
    },
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () =>
    console.log(`Server ready at http://localhost:${PORT}`)
  );
};

main().catch((err) => {
  console.error(err);
});
