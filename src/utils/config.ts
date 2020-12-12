/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";

dotenv.config();

let MONGODB_URI: string;
if (process.env.MONGODB_URI && process.env.NODE_ENV !== "test") {
  MONGODB_URI = process.env.MONGODB_URI;
} else if (process.env.TEST_MONGODB_URI && process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

let PORT: number;
if (process.env.PORT) {
  PORT = parseInt(process.env.PORT);
}

export { MONGODB_URI, PORT };
