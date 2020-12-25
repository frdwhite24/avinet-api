import supertest from "supertest";
import mongoose from "mongoose";
import { main } from "../../index";
import { UserModel } from "./model";
import { connect } from "../../database";

const api = supertest(main);

beforeEach(async () => {
  await connect();
  await UserModel.deleteMany({});

  const newUser = new UserModel({
    username: "freddo",
    password: "ashortpassword",
  });

  await newUser.save();

  const allUsers = await UserModel.find({});
  console.log(allUsers);
});

describe("Queries on user including", () => {
  test("getting all users", async () => {
    console.log("hello");
    const response = await api.post("/graphql").send({
      query: `query {
        getAllUsers {
          users {
            _id
            username
          }
        }
      }`,
    });

    console.log(response);
  });
});

afterAll(() => {
  console.log("disconnecting");
  void mongoose.connection.close();
});
