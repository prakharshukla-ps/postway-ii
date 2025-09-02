import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    gender: { type: String, required: true },
    avatar: {
      type: String,
      default: null,
    },
    tokens: [{ type: String }],
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
