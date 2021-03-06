import { MIN_PASSWORD_LENGTH } from "./config";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const notAuthorisedError = () => {
  return {
    errors: [
      {
        type: "authorisation error",
        message: "Not authorised to carry out this action.",
      },
    ],
  };
};

export const missingInvalidTokenError = () => {
  return {
    errors: [
      {
        type: "authorisation error",
        message: "Missing or invalid token.",
      },
    ],
  };
};

export const missingUserError = () => {
  return {
    errors: [
      {
        type: "user error",
        message: "User doesn't exist.",
      },
    ],
  };
};

export const userExistsError = () => {
  return {
    errors: [{ type: "user error", message: "Username already exists." }],
  };
};

export const incorrectPasswordError = () => {
  return {
    errors: [
      {
        type: "password error",
        message: "Incorrect password.",
      },
    ],
  };
};

export const mutationFailedError = (failedOn: string) => {
  return {
    errors: [
      {
        type: `${failedOn} error`,
        message: `Could not mutate ${failedOn}.`,
      },
    ],
  };
};

export const passwordTooShortError = () => {
  return {
    errors: [
      {
        type: "password error",
        message: `Password length is too short, minimum length is ${MIN_PASSWORD_LENGTH} chars.`,
      },
    ],
  };
};

export const alreadyFollowingError = () => {
  return {
    errors: [
      {
        type: "user error",
        message: "Already following this user.",
      },
    ],
  };
};

export const notFollowingError = () => {
  return {
    errors: [
      {
        type: "user error",
        message: "Not following this user.",
      },
    ],
  };
};

export const missingFollowerError = () => {
  return {
    errors: [
      {
        type: "user error",
        message: "This user is not a follower.",
      },
    ],
  };
};

export const notToSelfError = () => {
  return {
    errors: [
      {
        type: "user error",
        message: "Cannot carry out this action on yourself.",
      },
    ],
  };
};
