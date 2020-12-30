/* eslint-disable @typescript-eslint/no-floating-promises */
import csv from "csvtojson";
import { connect, disconnect } from "../database";
import { AirportModel } from "../schema/airports/model";
import { isError } from "./typeGuards";

const parseAndUploadData = async () => {
  const jsonArray = await csv().fromFile("./data/airports.csv");
  await connect();
  console.log("Wiping airport collection...");
  await AirportModel.deleteMany({});

  console.log("Uploading the documents...");
  try {
    await AirportModel.insertMany(jsonArray);
  } catch (error) {
    if (isError(error)) {
      console.error(error.message);
    }
  }

  console.log("Completed upload.");
  await disconnect();
};

parseAndUploadData();
