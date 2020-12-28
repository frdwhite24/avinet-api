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
  test("query getting followers", async () => {
    // Database and user setup
    const users = await generateUsers(2);
    const cleanedUsers = users.map(({ password: _password, ...rest }) => rest);

    const allUsers = await UserModel.find({});
    const firstUser = allUsers[0];
    const secondUser = allUsers[1];

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
    const getFollowers = `
      query {
        getFollowers {
          users {
            username
            firstName
            lastName
            emailAddress
          }
        }
      }
    `;

    await graphqlRequest({
      source: followUser,
      variableValues: {
        username: secondUser.username,
      },
      currentUser: firstUser,
    });

    const response = await graphqlRequest({
      source: getFollowers,
      currentUser: secondUser,
    });

    // Response check
    expect(response).toMatchObject({
      data: {
        getFollowers: {
          users: [cleanedUsers[0]],
        },
      },
    });

    // Database check
    const updatedUsers = await UserModel.find({}).lean();
    const followedUser = updatedUsers.find(
      (user) => user.username === secondUser.username
    );
    expect(followedUser?.followers).toEqual([firstUser._id]);
  });

  test("query getting following", async () => {
    // Database and user setup
    const users = await generateUsers(2);
    const cleanedUsers = users.map(({ password: _password, ...rest }) => rest);

    const allUsers = await UserModel.find({});
    const firstUser = allUsers[0];
    const secondUser = allUsers[1];

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
    const getFollowing = `
      query {
        getFollowing {
          users {
            username
            firstName
            lastName
            emailAddress
          }
        }
      }
    `;

    await graphqlRequest({
      source: followUser,
      variableValues: {
        username: secondUser.username,
      },
      currentUser: firstUser,
    });

    const response = await graphqlRequest({
      source: getFollowing,
      currentUser: firstUser,
    });

    // Response check
    expect(response).toMatchObject({
      data: {
        getFollowing: {
          users: [cleanedUsers[1]],
        },
      },
    });

    // Database check
    const updatedUsers = await UserModel.find({}).lean();
    const followedUser = updatedUsers.find(
      (user) => user.username === firstUser.username
    );
    expect(followedUser?.following).toEqual([secondUser._id]);
  });

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
