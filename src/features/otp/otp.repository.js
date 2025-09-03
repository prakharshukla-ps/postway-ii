import { hashPassword } from "../../utils/hashPassword.js";
import { UserModel } from "../user/user.schema.js";
import { OtpModel } from "./otp.schema.js";

export default class OtpRepository {
  async sendOtpRepo(email, otp) {
    try {
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      return await OtpModel.create({ email, otp, expiresAt });
    } catch (err) {
      throw err;
    }
  }

  async verifyOtpRepo(email, otp) {
    try {
      const otpEntry = await OtpModel.findOne({ email, otp });

      if (!otpEntry) return null;
      if (otpEntry.expiresAt < new Date()) return null;

      otpEntry.verified = true;
      await otpEntry.save();

      return otpEntry;
    } catch (err) {
      throw err;
    }
  }

  async resetPasswordRepo(email, newPassword) {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) return null;

      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();

      return user;
    } catch (err) {
      throw err;
    }
  }
}
