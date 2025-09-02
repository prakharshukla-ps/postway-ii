import CommentRepository from "./comment.repository.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async getAllComments(req, res, next) {
    try {
      const { postId } = req.params;

      if (!postId) {
        return next(new CustomErrorHandler(400, "Post ID is required!"));
      }

      const comments = await this.commentRepository.getAllCommentsRepo(postId);

      res.status(200).json({
        success: true,
        comments,
      });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.userId;
      const { text } = req.body;

      if (!postId) {
        return next(new CustomErrorHandler(400, "Post ID is required!"));
      }

      if (!text) {
        return next(new CustomErrorHandler(400, "Comment text is required!"));
      }

      const comment = await this.commentRepository.addCommentRepo(
        postId,
        userId,
        text
      );

      res.status(201).json({
        success: true,
        message: "Comment added successfully.",
        comment,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const userId = req.userId;

      if (!commentId) {
        return next(new CustomErrorHandler(400, "Comment ID is required!"));
      }

      const deletedComment = await this.commentRepository.deleteCommentRepo(
        commentId,
        userId
      );

      if (!deletedComment) {
        return next(
          new CustomErrorHandler(
            404,
            "Comment not found or you are not authorized to delete it!"
          )
        );
      }

      res.status(200).json({
        success: true,
        message: "Comment deleted successfully.",
        comment: deletedComment,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const userId = req.userId;
      const { text } = req.body;

      if (!commentId) {
        return next(new CustomErrorHandler(400, "Comment ID is required!"));
      }

      if (!text) {
        return next(new CustomErrorHandler(400, "Comment text is required!"));
      }

      const updatedComment = await this.commentRepository.updateCommentRepo(
        commentId,
        userId,
        text
      );

      if (!updatedComment) {
        return next(
          new CustomErrorHandler(
            404,
            "Comment not found or you are not authorized to update it!"
          )
        );
      }

      res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    } catch (err) {
      next(err);
    }
  }
}
