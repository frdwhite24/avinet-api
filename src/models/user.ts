import { Schema, model } from "mongoose";
// import "mongoose-type-email";

const schema = new Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  emailAddress: {
    type: String,
    // type: SchemaTypes.Email,
    required: true,
    unique: true,
  },
});

const userModel = model("User", schema);

export default userModel;
