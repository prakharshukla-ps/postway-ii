import { FriendModel } from "./friend.schema.js";

export default class FriendRepository {
  async getUserFriendsRepo(userId) {
    try {
      const friends = await FriendModel.find({
        status: "accepted",
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate("sender", "name email")
        .populate("receiver", "name email");

      const friendList = friends.map((friend) =>
        friend.sender._id.equals(userId) ? friend.receiver : friend.sender
      );

      return friendList;
    } catch (err) {
      throw err;
    }
  }

  async getPendingRequestsRepo(userId) {
    try {
      const pendingRequests = await FriendModel.find({
        status: "pending",
        receiver: userId,
      }).populate("sender", "name email");

      return pendingRequests;
    } catch (err) {
      throw err;
    }
  }

  async toggleFriendshipRepo(userId, friendId) {
    try {
      let friendship = await FriendModel.findOne({
        $or: [
          { sender: userId, receiver: friendId },
          { sender: friendId, receiver: userId },
        ],
      });

      if (friendship) {
        // If friendship already exists
        if (friendship.status === "accepted") {
          // Already friends → unfriend
          await friendship.deleteOne();
          return { action: "removed" };
        }

        if (friendship.status === "pending") {
          if (friendship.sender.equals(userId)) {
            // User sent request → cancel
            await friendship.deleteOne();
            return { action: "cancelled" };
          } else {
            // User received request → accept
            friendship.status = "accepted";
            await friendship.save();
            return { action: "accepted", friendship };
          }
        }

        if (friendship.status === "rejected") {
          // Previously rejected → allow re-request
          friendship.status = "pending";
          friendship.sender = userId;
          friendship.receiver = friendId;
          await friendship.save();
          return { action: "requested", friendship };
        }
      }

      // If no friendship, create new
      friendship = await FriendModel.create({
        sender: userId,
        receiver: friendId,
        status: "pending",
      });

      return { action: "requested", friendship };
    } catch (err) {
      throw err;
    }
  }

  async responseToRequestRepo(userId, friendId, action) {
    try {
      const friendship = await FriendModel.findOne({
        sender: friendId,
        receiver: userId,
        status: "pending",
      });

      if (!friendship) {
        return { error: "No pending request found!" };
      }

      if (action === "accept") {
        friendship.status = "accepted";
        await friendship.save();
        return { action: "accepted", friendship };
      }

      if (action === "reject") {
        friendship.status = "rejected";
        await friendship.save();
        return { action: "rejected", friendship };
      }

      return { error: "Invalid action" };
    } catch (err) {
      throw err;
    }
  }
}
