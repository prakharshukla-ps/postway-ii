import CustomErrorHandler from "../../utils/errorHandler.js";
import FriendRepository from "./friend.repository.js";

export default class FriendController {
  constructor() {
    this.friendRepository = new FriendRepository();
  }

  async getUserFriends(req, res, next) {
    try {
      const { userId } = req.params;

      const friends = await this.friendRepository.getUserFriendsRepo(userId);
      res.status(200).json({ success: true, friends });
    } catch (err) {
      next(err);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const userId = req.userId;

      if (!userId) {
        return next(new CustomErrorHandler(400, "Valid userId is required!"));
      }

      const requests = await this.friendRepository.getPendingRequestsRepo(
        userId
      );

      res.status(200).json({
        success: true,
        count: requests.length,
        requests,
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleFriendship(req, res, next) {
    try {
      const { friendId } = req.params;
      const userId = req.userId;

      if (!userId || !friendId) {
        return next(
          new CustomErrorHandler(400, "Valid userId and friendId are required!")
        );
      }

      const result = await this.friendRepository.toggleFriendshipRepo(
        userId,
        friendId
      );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async responseToRequest(req, res, next) {
    try {
      const userId = req.userId;
      const { friendId } = req.params;
      const { action } = req.body;

      if (!["accept", "reject"].includes(action)) {
        return next(
          new CustomErrorHandler(400, "Action must be either accept or reject!")
        );
      }

      const result = await this.friendRepository.responseToRequestRepo(
        userId,
        friendId,
        action
      );

      if (result.error) {
        return next(new CustomErrorHandler(404, result.error));
      }

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
