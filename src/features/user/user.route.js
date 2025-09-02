import express from "express";
import fileUpload from "../../middlewares/fileUpload.js";
import jwtAuth from "../../middlewares/jwtAuth.js";
import UserController from "./user.controller.js";

const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/signUp", fileUpload.single("avatar"), (req, res, next) =>
  userController.signUp(req, res, next)
);
userRouter.post("/signIn", (req, res, next) =>
  userController.signIn(req, res, next)
);
userRouter.post("/logout", jwtAuth, (req, res, next) =>
  userController.logout(req, res, next)
);
userRouter.post("/logout-all-devices", jwtAuth, (req, res, next) =>
  userController.logoutAllDevices(req, res, next)
);
userRouter.get("/get-details/:userId", jwtAuth, (req, res, next) =>
  userController.getUserDetails(req, res, next)
);
userRouter.get("/get-all-details", jwtAuth, (req, res, next) =>
  userController.getAllUserDetails(req, res, next)
);
userRouter.put(
  "/update-details/:userId",
  jwtAuth,
  fileUpload.single("avatar"),
  (req, res, next) => userController.updateUserDetails(req, res, next)
);

export default userRouter;
