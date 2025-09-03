import CustomErrorHandler from "../../utils/errorHandler.js";
import { sendEmail } from "../../utils/mailer.js";
import { UserModel } from "../user/user.schema.js";
import OtpRepository from "./otp.repository.js";

export default class OtpController {
  constructor() {
    this.otpRepository = new OtpRepository();
  }

  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return next(new CustomErrorHandler(400, "Email is required!"));
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        return next(
          new CustomErrorHandler(404, "User with this email does not exist!")
        );
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await this.otpRepository.sendOtpRepo(email, otp);
      await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

      res.status(200).json({ message: "OTP sent to email." });
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return next(new CustomErrorHandler(400, "Email and OTP are required!"));
      }

      const result = await this.otpRepository.verifyOtpRepo(email, otp);

      if (!result) {
        return next(new CustomErrorHandler(400, "Invalid or expired OTP!"));
      }

      res.status(200).json({ message: "OTP verified successfully." });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return next(
          new CustomErrorHandler(
            400,
            "Email, OTP, and new password are required!"
          )
        );
      }

      const validOtp = await this.otpRepository.verifyOtpRepo(email, otp);

      if (!validOtp || !validOtp.verified) {
        return next(
          new CustomErrorHandler(400, "OTP not verified or expired!")
        );
      }

      const user = await this.otpRepository.resetPasswordRepo(
        email,
        newPassword
      );

      if (!user) {
        return next(new CustomErrorHandler(404, "User not found!"));
      }

      res.status(200).json({ message: "Password reset successful." });
    } catch (err) {
      next(err);
    }
  }
}
