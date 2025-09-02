import bcrypt from "bcrypt";
import CustomErrorHandler from "./errorHandler.js";

const hashPassword = async (password, next) => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (err) {
    next(new CustomErrorHandler(400, "Encountered error in hashing password!"));
  }
};

const compareHashedPassword = async (password, hashPassword, next) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (err) {
    next(
      new CustomErrorHandler(
        400,
        "Encountered error in comparing hashing password!"
      )
    );
  }
};

export { compareHashedPassword, hashPassword };
