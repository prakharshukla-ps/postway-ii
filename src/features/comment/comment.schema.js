import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },

    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model("Comment", commentSchema);
