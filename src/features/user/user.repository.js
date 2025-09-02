import { UserModel } from "./user.schema.js";

export default class UserRepository {
  async signUpRepo(userData) {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (err) {
      throw err;
    }
  }

  async findByEmailRepo(email) {
    return await UserModel.findOne({ email });
  }

  async logoutRepo(userId, token) {
    try {
      return await UserModel.updateOne(
        { _id: userId },
        { $pull: { tokens: token } }
      );
    } catch (err) {
      throw err;
    }
  }

  async logoutAllDevicesRepo(userId) {
    try {
      return await UserModel.updateOne(
        { _id: userId },
        { $set: { tokens: [] } }
      );
    } catch (err) {
      throw err;
    }
  }

  async getUserDetailsRepo(userId) {
    try {
      return await UserModel.findById(userId).select("-password -tokens");
    } catch (err) {
      throw err;
    }
  }

  async getAllUserDetailsRepo() {
    try {
      return await UserModel.find().select("-password -tokens");
    } catch (err) {
      throw err;
    }
  }

  async updateUserDetailsRepo(userId, updateData) {
    try {
      return await UserModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password -tokens");
    } catch (err) {
      throw err;
    }
  }
}
