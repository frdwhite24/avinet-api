import { hash } from "argon2";
import faker from "faker";
import { UserModel } from "../schema/users/model";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const generateUsers = async (numUsers: number) => {
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
