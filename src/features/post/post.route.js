import express from "express";
import fileUpload from "../../middlewares/fileUpload.js";
import PostController from "./post.controller.js";

const postRouter = express.Router();

const postController = new PostController();

postRouter.get("/all", (req, res, next) =>
  postController.getAllPosts(req, res, next)
);
postRouter.get("/user/:userId", (req, res, next) =>
  postController.getUserPosts(req, res, next)
);
postRouter.post("/", fileUpload.single("postImage"), (req, res, next) =>
  postController.createNewPost(req, res, next)
);
postRouter.get("/:postId", (req, res, next) =>
  postController.getPostById(req, res, next)
);
postRouter.delete("/:postId", (req, res, next) =>
  postController.deletePost(req, res, next)
);
postRouter.put("/:postId", fileUpload.single("postImage"), (req, res, next) =>
  postController.updatePost(req, res, next)
);

export default postRouter;
