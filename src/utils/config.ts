/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";

dotenv.config();

const isString = (value: any): value is string => {
  return typeof value === "string" || value instanceof String;
};

const parseString = (value: any): string => {
  if (!value || !isString(value)) {
    throw new Error("Incorrect or missing value: " + String(value));
  }
  return value;
};

export const MONGODB_URI = parseString(process.env.MONGODB_URI);
