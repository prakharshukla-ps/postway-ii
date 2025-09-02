import { PostModel } from "./post.schema.js";

export default class PostRepository {
  async getAllPostsRepo(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name avatar")
        .lean();

      const totalPosts = await PostModel.countDocuments();

      return {
        posts,
        pagination: {
          totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: page,
          pageSize: limit,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async getUserPostsRepo(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const posts = await PostModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name avatar");

      const totalPosts = await PostModel.countDocuments({ user: userId });

      return {
        posts,
        pagination: {
          totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: page,
          pageSize: limit,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async createNewPostRepo(postData) {
    try {
      const newPost = new PostModel(postData);
      const savedPost = await newPost.save();

      return await savedPost.populate("user", "name avatar");
    } catch (err) {
      throw err;
    }
  }

  async getPostByIdRepo(postId) {
    try {
      const post = await PostModel.findById(postId).populate(
        "user",
        "name avatar"
      );

      return post;
    } catch (err) {
      throw err;
    }
  }

  async deletePostRepo(postId, userId) {
    try {
      const deletedPost = await PostModel.findOneAndDelete({
        _id: postId,
        user: userId,
      });

      return deletedPost;
    } catch (err) {
      throw err;
    }
  }

  async updatePostRepo(postId, userId, updateData) {
    try {
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId, user: userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return updatedPost.populate("user", "name avatar");
    } catch (err) {
      throw err;
    }
  }
}
