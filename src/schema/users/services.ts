import { DocumentType } from "@typegoose/typegoose";
import { User, UserModel } from "./model";

export const getUser = async (
  username: string,
  populate = true
): Promise<DocumentType<User> | null> => {
  if (populate) {
    return await UserModel.findOne({ username })
      .populate("followers")
      .populate("following");
  }
  return await UserModel.findOne({ username });
};

export const getAllUsers = async (): Promise<DocumentType<User>[] | null> => {
  return await UserModel.find({}).populate("followers").populate("following");
};
