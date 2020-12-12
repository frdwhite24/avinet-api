import express from "express";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";

import { connect } from "./database";
import { PORT } from "./utils/config";
import buildSchema from "./schema/index";

const main = async () => {
  await connect();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema(),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () =>
    console.log(`Server ready at http://localhost:${PORT}`)
  );
};

main().catch((err) => {
  console.error(err);
});
