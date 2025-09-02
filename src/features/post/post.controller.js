import CustomErrorHandler from "../../utils/errorHandler.js";
import PostRepository from "./post.repository.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  async getAllPosts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const data = await this.postRepository.getAllPostsRepo(page, limit);

      res.status(200).json({
        success: true,
        ...data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserPosts(req, res, next) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const data = await this.postRepository.getUserPostsRepo(
        userId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        ...data,
      });
    } catch (err) {
      next(err);
    }
  }

  async createNewPost(req, res, next) {
    try {
      const { caption } = req.body;

      let postImage = null;
      if (req.file) {
        postImage = req.file.filename;
      }

      const userId = req.userId;

      if (!caption) {
        return next(new CustomErrorHandler(400, "Caption is required!"));
      }

      const postData = {
        user: userId,
        caption,
        postImage: postImage,
      };

      const newPost = await this.postRepository.createNewPostRepo(postData);

      res.status(201).json({
        success: true,
        message: "Post created successfully!",
        post: newPost,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPostById(req, res, next) {
    try {
      const { postId } = req.params;

      if (!postId) {
        return next(new CustomErrorHandler(400, "Post ID is required!"));
      }

      const post = await this.postRepository.getPostByIdRepo(postId);

      if (!post) {
        return next(new CustomErrorHandler(404, "Post not found!"));
      }

      res.status(200).json({
        success: true,
        post,
      });
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.userId;

      if (!postId) {
        return next(new CustomErrorHandler(400, "Post ID is required!"));
      }

      const deletedPost = await this.postRepository.deletePostRepo(
        postId,
        userId
      );

      if (!deletedPost) {
        return next(
          new CustomErrorHandler(
            404,
            "Post not found or you are not authorized to delete it!"
          )
        );
      }

      res.status(200).json({
        success: true,
        message: "Post deleted successfully.",
        post: deletedPost,
      });
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.userId;
      const { caption } = req.body;
      const postImage = req.file?.filename;

      if (!postId) {
        return next(new CustomErrorHandler(400, "Post ID is required!"));
      }

      if (!caption) {
        return next(new CustomErrorHandler(400, "Caption is required!"));
      }

      const updateData = {};
      if (caption) updateData.caption = caption;
      if (postImage) updateData.postImage = postImage;

      const updatedPost = await this.postRepository.updatePostRepo(
        postId,
        userId,
        updateData
      );

      if (!updatedPost) {
        return next(
          new CustomErrorHandler(
            404,
            "Post not found or you are not authorized to update it!"
          )
        );
      }

      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        post: updatedPost,
      });
    } catch (err) {
      next(err);
    }
  }
}
