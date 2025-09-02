import { PostModel } from "../post/post.schema.js";
import { CommentModel } from "./comment.schema.js";

export default class CommentRepository {
  async getAllCommentsRepo(postId) {
    try {
      const comments = await CommentModel.find({ post: postId })
        .populate("user", "name avatar")
        .sort({ createdAt: -1 })
        .lean();

      return comments;
    } catch (err) {
      throw err;
    }
  }

  async addCommentRepo(postId, userId, text) {
    try {
      const comment = await CommentModel.create({
        post: postId,
        user: userId,
        text,
      });

      await PostModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

      return comment;
    } catch (err) {
      throw err;
    }
  }

  async deleteCommentRepo(commentId, userId) {
    try {
      const deletedComment = await CommentModel.findOneAndDelete({
        _id: commentId,
        user: userId,
      });

      if (!deletedComment) {
        return null;
      }

      await PostModel.findByIdAndUpdate(deletedComment.post, {
        $inc: { commentsCount: -1 },
      });

      return deletedComment;
    } catch (err) {
      throw err;
    }
  }

  async updateCommentRepo(commentId, userId, text) {
    try {
      const updatedComment = await CommentModel.findOneAndUpdate(
        { _id: commentId, user: userId },
        { $set: { text } },
        { new: true, runValidators: true }
      );

      return updatedComment;
    } catch (err) {
      throw err;
    }
  }
}
