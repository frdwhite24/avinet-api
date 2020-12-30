/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import papa from "papaparse";
import request from "request";

const options = { download: true, header: true, delimiter: "," };

const processData = () => {
  console.log(data);
  console.log(data.length);
  const timeBefore = new Date().getTime();
  console.log(data.filter((airport) => airport.name.includes("Headcorn")));
  const timeAfter = new Date().getTime();
  console.log("time:", timeAfter - timeBefore, "ms");

  const timeBefore1 = new Date().getTime();
  console.log(data.filter((airport) => airport.name.includes("Gatwick")));
  const timeAfter1 = new Date().getTime();
  console.log("time:", timeAfter1 - timeBefore1, "ms");
};

const parseStream = papa.parse(papa.NODE_STREAM_INPUT, options);

const dataStream = request
  .get("https://ourairports.com/data/airports.csv")
  .pipe(parseStream);

const data: any[] = [];

parseStream.on("data", (chunk) => {
  data.push(chunk);
});

dataStream.on("finish", processData);
