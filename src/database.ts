import mongoose from "mongoose";

import { MONGODB_URI } from "./utils/config";

export const connect = async (): Promise<void> => {
  console.log("Connecting to", MONGODB_URI);

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log("Connected to MongoDB");
};

export const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};
