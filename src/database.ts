import mongoose from "mongoose";

import { MONGODB_URI } from "./utils/config";

let database: mongoose.Connection;

export const connect = async (): Promise<void> => {
  if (database) {
    return;
  }

  console.log("Connecting to", MONGODB_URI);

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log("Connected to MongoDB");
};

export const disconnect = (): void => {
  if (!database) {
    return;
  }
  void mongoose.disconnect();
};
