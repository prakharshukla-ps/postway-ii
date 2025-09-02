import { CommentModel } from "../comment/comment.schema.js";
import { PostModel } from "../post/post.schema.js";
import { LikeModel } from "./like.schema.js";

export default class LikeRepository {
  async getLikesRepo(likedItemId, likedItemType) {
    try {
      const likes = await LikeModel.find({
        likedItem: likedItemId,
        likedItemType: likedItemType,
      }).populate("user", "name avatar");

      return likes;
    } catch (err) {
      throw err;
    }
  }

  async toggleLikeRepo(userId, likedItemId, likedItemType) {
    try {
      const existingLike = await LikeModel.findOne({
        user: userId,
        likedItem: likedItemId,
        likedItemType,
      });

      const Model = likedItemType === "Post" ? PostModel : CommentModel;

      if (existingLike) {
        // Remove like and decrement count
        await LikeModel.findByIdAndDelete(existingLike._id);
        await Model.findByIdAndUpdate(likedItemId, {
          $inc: { likesCount: -1 },
        });

        return { liked: false };
      } else {
        // Create like and increment count
        await LikeModel.create({
          user: userId,
          likedItem: likedItemId,
          likedItemType,
        });
        await Model.findByIdAndUpdate(likedItemId, { $inc: { likesCount: 1 } });

        return { liked: true };
      }
    } catch (err) {
      throw err;
    }
  }
}
