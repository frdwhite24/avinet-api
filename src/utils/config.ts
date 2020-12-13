/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";

dotenv.config();

let MONGODB_URI: string;
if (process.env.MONGODB_URI && process.env.NODE_ENV !== "test") {
  MONGODB_URI = process.env.MONGODB_URI;
} else if (process.env.TEST_MONGODB_URI && process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const JWT_SECRET: string = process.env.JWT_SECRET
  ? process.env.JWT_SECRET
  : "badsecret";

export { MONGODB_URI, PORT, JWT_SECRET };
