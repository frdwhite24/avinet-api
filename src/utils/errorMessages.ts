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

export const existingUserError = () => {
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
