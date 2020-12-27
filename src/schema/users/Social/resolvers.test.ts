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

describe("User social resolvers", () => {
  test("mutation following a user", async () => {
    // Database and user setup
    const users = await generateUsers(2);
    const cleanedUsers = users.map(({ password: _password, ...rest }) => rest);

    const modelQuery = await UserModel.find({ username: users[0].username });
    const currentUser = modelQuery[0];
    const userWithUpdate = {
      ...cleanedUsers[0],
      following: [{ username: users[1].username }],
      followers: [],
    };

    // Request;
    const followUser = `
      mutation followUser($username: String!) {
        followUser(username: $username) {
          user {
            username
            firstName
            lastName
            emailAddress
            following {
              username
            }
            followers {
              username
            }
          }
        }
      }
    `;

    const response = await graphqlRequest({
      source: followUser,
      variableValues: {
        username: users[1].username,
      },
      currentUser,
    });

    // Response check
    expect(response).toMatchObject({
      data: {
        followUser: {
          user: userWithUpdate,
        },
      },
    });

    // Database check
    const allUsers = await UserModel.find({}).lean();
    const followingUser = allUsers.find(
      (user) => user.username === users[0].username
    );
    const followedUser = allUsers.find(
      (user) => user.username === users[1].username
    );
    expect(followingUser?.following).toEqual([followedUser?._id]);
    expect(followedUser?.followers).toEqual([followingUser?._id]);
  });
});
