import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
});

const userModel = model("User", schema);

export default userModel;
