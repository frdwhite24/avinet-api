import mongoose from "mongoose";

import { MONGODB_URI } from "./utils/config";

let database: mongoose.Connection;

export const connect = (): void => {
  if (database) {
    return;
  }

  console.log("Connecting to", MONGODB_URI);

  void mongoose
    .connect(MONGODB_URI, {
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
};

export const disconnect = (): void => {
  if (!database) {
    return;
  }
  void mongoose.disconnect();
};
