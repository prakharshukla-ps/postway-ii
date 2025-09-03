import jwt from "jsonwebtoken";
import CustomErrorHandler from "../../utils/errorHandler.js";
import {
  compareHashedPassword,
  hashPassword,
} from "../../utils/hashPassword.js";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, gender } = req.body;

      if (!name || !email || !password || !gender) {
        return next(new CustomErrorHandler(400, "All fields are required!"));
      }

      const existingUser = await this.userRepository.findByEmailRepo(email);

      if (existingUser) {
        return next(new CustomErrorHandler(400, "Email already in use!"));
      }

      const hashedPassword = await hashPassword(password);

      let avatar = null;
      if (req.file) {
        avatar = req.file.filename;
      }

      const newUser = await this.userRepository.signUpRepo({
        name,
        email,
        password: hashedPassword,
        gender,
        avatar,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        user: {
          name: newUser.name,
          email: newUser.email,
          gender: newUser.gender,
          avatar: newUser.avatar,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          new CustomErrorHandler(400, "Email and password are required!")
        );
      }

      const user = await this.userRepository.findByEmailRepo(email);
      if (!user) {
        return next(new CustomErrorHandler(404, "User not found!"));
      }

      const isMatch = await compareHashedPassword(password, user.password);
      if (!isMatch) {
        return next(new CustomErrorHandler(401, "Invalid credentials!"));
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      user.tokens.push(token);
      await user.save();

      res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user: {
          name: user.name,
          email: user.email,
          gender: user.gender,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.token;
      const userId = req.userId;

      if (!token || !userId) {
        return next(new CustomErrorHandler(401, "Unauthorized request!"));
      }

      await this.userRepository.logoutRepo(userId, token);

      res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async logoutAllDevices(req, res, next) {
    try {
      const userId = req.userId;

      await this.userRepository.logoutAllDevicesRepo(userId);

      res.status(200).json({
        success: true,
        message: "Logged out from all devices successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async getUserDetails(req, res, next) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return next(new CustomErrorHandler(400, "User ID is required!"));
      }

      const user = await this.userRepository.getUserDetailsRepo(userId);

      if (!user) {
        return next(new CustomErrorHandler(404, "User not found!"));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllUserDetails(req, res, next) {
    try {
      const users = await this.userRepository.getAllUserDetailsRepo();
      res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUserDetails(req, res, next) {
    try {
      const { userId } = req.params;
      const { name, email, gender } = req.body;

      if (!name && !email && !gender && !req.file) {
        return next(new CustomErrorHandler(400, "Nothing to update!"));
      }

      const updatedUser = await this.userRepository.updateUserDetailsRepo(
        userId,
        { name, email, gender, avatar: req.file?.filename }
      );

      if (!updatedUser) {
        return next(new CustomErrorHandler(404, "User not found!"));
      }

      res.status(200).json({
        success: true,
        message: "User details updated successfully.",
        user: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }
}
