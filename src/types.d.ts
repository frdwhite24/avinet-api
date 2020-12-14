import { Types } from "mongoose";
import { User } from "./schema/users/model";

type MyContext = {
  currentUser: User | null;
};

type MyToken = {
  id: Types.ObjectId | undefined;
  username: string;
};
