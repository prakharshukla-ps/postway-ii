import jwt from "jsonwebtoken";
import CustomErrorHandler from "../utils/errorHandler.js";

const jwtAuth = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return next(
      new CustomErrorHandler(401, "Unauthorized access - No token provided!")
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = payload.userId;
    req.token = token;

    next();
  } catch (err) {
    return next(
      new CustomErrorHandler(
        401,
        "Unauthorized access - Invalid or expired token!"
      )
    );
  }
};

export default jwtAuth;
