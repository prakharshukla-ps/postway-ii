import CustomErrorHandler from "../../utils/errorHandler.js";
import LikeRepository from "./like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async getLikes(req, res, next) {
    try {
      const { id } = req.params;
      const { type } = req.query;

      if (!id || !type || !["Post", "Comment"].includes(type)) {
        return next(
          new CustomErrorHandler(400, "Valid ID and type are required!")
        );
      }

      const likes = await this.likeRepository.getLikesRepo(id, type);

      res.status(200).json({
        success: true,
        likes,
        count: likes.length,
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const { id } = req.params;
      const { type } = req.query;
      const userId = req.userId;

      if (!id || !type || !["Post", "Comment"].includes(type)) {
        return next(
          new CustomErrorHandler(400, "Valid ID and type are required!")
        );
      }

      const result = await this.likeRepository.toggleLikeRepo(userId, id, type);

      res.status(200).json({
        success: true,
        message: result.liked
          ? `${type} liked successfully.`
          : `${type} unliked successfully.`,
        liked: result.liked,
      });
    } catch (err) {
      next(err);
    }
  }
}
