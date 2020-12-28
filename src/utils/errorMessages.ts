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
    errors: [{ type: "user error", message: "That username already exists." }],
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
