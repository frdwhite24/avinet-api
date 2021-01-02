import { connect, disconnect } from "../../database";
import { generateFlights } from "../../test-utils/generators";
import { graphqlRequest } from "../../test-utils/graphqlRequest";
import { FlightModel } from "./model";

beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  await FlightModel.deleteMany({});
});

afterAll(async () => {
  await disconnect();
});

describe("Querying flights", () => {
  test("to get all flights", async () => {
    // Database setup
    const { flights } = await generateFlights(3);

    // Request
    const getAllFlights = `
      query {
        getAllFlights {
          flights {
            totalFlightTime
            title
          }
        }
      }
    `;
    const response = await graphqlRequest({
      source: getAllFlights,
    });

    // Response check
    expect(response).toMatchObject({
      data: {
        getAllFlights: {
          flights: flights.map((flight) => {
            return {
              totalFlightTime: flight.totalFlightTime,
              title: flight.title,
            };
          }),
        },
      },
    });
  });

  test("to get one flight", async () => {
    // Database setup
    const { dbFlights } = await generateFlights(3);

    // Request
    const getFlight = `
      query getFlight($id: String!){
        getFlight(id: $id) {
          flight {
            _id
            totalFlightTime
            title
          }
        }
      }
    `;
    const response = await graphqlRequest({
      source: getFlight,
      variableValues: {
        id: dbFlights[1]._id.toString(),
      },
    });

    console.log(response);

    // Response check
    expect(response).toMatchObject({
      data: {
        getFlight: {
          flight: {
            _id: dbFlights[1]._id.toString(),
            totalFlightTime: dbFlights[1].totalFlightTime,
            title: dbFlights[1].title,
          },
        },
      },
    });
  });
});
