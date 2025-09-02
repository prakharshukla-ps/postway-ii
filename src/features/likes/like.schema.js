const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likedItem: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "likedItemType",
      required: true,
    },
    likedItemType: {
      type: String,
      required: true,
      enum: ["Post", "Comment"],
    },
  },
  { timestamps: true }
);

export const LikeModel = mongoose.model("Like", likeSchema);
