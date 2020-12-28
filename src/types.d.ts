import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "./schema/users/model";

type MyContext = {
  currentUser: DocumentType<User> | null;
};

type MyToken = {
  id: Types.ObjectId | undefined;
  username: string;
};
