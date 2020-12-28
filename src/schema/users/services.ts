import { DocumentType } from "@typegoose/typegoose";
import { User, UserModel } from "./model";

export const getUser = async (
  username: string
): Promise<DocumentType<User> | null> => {
  return await UserModel.findOne({ username })
    .populate("followers")
    .populate("following");
};

export const getAllUsers = async (): Promise<DocumentType<User>[] | null> => {
  return await UserModel.find({}).populate("followers").populate("following");
};
