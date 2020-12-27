import { hash } from "argon2";
import faker from "faker";

import { graphqlRequest } from "../../../test-utils/graphqlRequest";
import { connect, disconnect } from "../../../database";
import { UserModel } from "../model";

const generateUsers = async (numUsers: number) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      emailAddress: faker.internet.email(),
    };

    users.push(user);

    const newUser = new UserModel({
      username: user.username,
      password: await hash(user.password),
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });

    await newUser.save();
  }

  return users;
};

beforeEach(async () => {
  await connect();
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await disconnect();
});

describe("Query", () => {
  test("getting all users", async () => {
    // Database setup
    const users = await generateUsers(3);
    const usersNoPw = users.map(({ password: _password, ...rest }) => rest);

    // Request
    const getAllUsers = `
      query {
        getAllUsers {
          users {
            username
            firstName
            lastName
            emailAddress
          }
        }
      }
    `;
    const response = await graphqlRequest({
      source: getAllUsers,
    });

    // Response check
    expect(response).toMatchObject({
      data: {
        getAllUsers: {
          users: usersNoPw,
        },
      },
    });

    // Database check
    const allUsers = await UserModel.find({});
    usersNoPw.forEach((user) => {
      expect(allUsers).toEqual(
        expect.arrayContaining([expect.objectContaining(user)])
      );
    });
  });

  test("getting one user", async () => {
    // Database setup
    const users = await generateUsers(1);
    const usersNoPw = users.map(({ password: _password, ...rest }) => rest);

    // Request
    const getUser = `
      query getUser($username: String!) {
        getUser(username: $username) {
          user {
            username
            firstName
            lastName
            emailAddress
          }
        }
      }
    `;
    const response = await graphqlRequest({
      source: getUser,
      variableValues: {
        username: users[0].username,
      },
    });

    // Response check
    expect(response).toMatchObject({
      data: {
        getUser: {
          user: usersNoPw[0],
        },
      },
    });

    // Database check
    const dbUser = await UserModel.find({ username: users[0].username });
    expect(dbUser[0]).toEqual(expect.objectContaining(usersNoPw[0]));
  });
});
