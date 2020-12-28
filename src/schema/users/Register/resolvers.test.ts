import { connect, disconnect } from "../../../database";
import { graphqlRequest } from "../../../test-utils/graphqlRequest";
import { generateUsers } from "../../../test-utils/userGen";
import { UserModel } from "../model";

beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await disconnect();
});

describe("User register resolvers", () => {
  test("query getting all users", async () => {
    // Database setup
    const { cleanedUsers } = await generateUsers(3);

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
          users: cleanedUsers,
        },
      },
    });

    // Database check
    const allUsers = await UserModel.find({});
    cleanedUsers.forEach((user) => {
      expect(allUsers).toEqual(
        expect.arrayContaining([expect.objectContaining(user)])
      );
    });
  });

  test("query getting one user", async () => {
    // Database setup
    const { cleanedUsers } = await generateUsers(2);

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
        username: cleanedUsers[0].username,
      },
    });

    // Response check
    expect(response).toMatchObject({
      data: {
        getUser: {
          user: cleanedUsers[0],
        },
      },
    });

    // Database check
    const dbUser = await UserModel.find({ username: cleanedUsers[0].username });
    expect(dbUser.length).toEqual(1);
    expect(dbUser[0]).toEqual(expect.objectContaining(cleanedUsers[0]));
  });

  test("query who am I", async () => {
    // Database and user setup
    const { cleanedUsers, dbUsers } = await generateUsers();

    // Request;
    const whoAmI = `
      query {
        whoAmI {
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
      source: whoAmI,
      currentUser: dbUsers[0],
    });

    // Response check
    expect(response).toMatchObject({
      data: {
        whoAmI: {
          user: cleanedUsers[0],
        },
      },
    });
  });
});
