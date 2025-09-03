import bcrypt from "bcrypt";
import CustomErrorHandler from "./errorHandler.js";

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (err) {
    throw new CustomErrorHandler(400, "Encountered error in hashing password!");
  }
};

const compareHashedPassword = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (err) {
    throw new CustomErrorHandler(
      400,
      "Encountered error in comparing hashed password!"
    );
  }
};

export { compareHashedPassword, hashPassword };
