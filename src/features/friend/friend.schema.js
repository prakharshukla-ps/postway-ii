import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({});

export const FriendModel = mongoose.model("Friend", friendSchema);
