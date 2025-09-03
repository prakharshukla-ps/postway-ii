import "./env.js";

import express from "express";
import { connectToDB } from "./src/config/mongooseConfig.js";
import commentRouter from "./src/features/comment/comment.route.js";
import friendRouter from "./src/features/friend/friend.route.js";
import likeRouter from "./src/features/like/like.route.js";
import postRouter from "./src/features/post/post.route.js";
import userRouter from "./src/features/user/user.route.js";
import jwtAuth from "./src/middlewares/jwtAuth.js";

const server = express();

server.use(express.json());

server.use("/api/users", userRouter);
server.use("/api/posts", jwtAuth, postRouter);
server.use("/api/comments", jwtAuth, commentRouter);
server.use("/api/likes", jwtAuth, likeRouter);
server.use("/api/friends", jwtAuth, friendRouter);

server.get("/", (req, res) => {
  res.send("Welcome to postway");
});

server.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error! Try later!!";

  res.status(statusCode).json({ success: false, error: message });
});

server.use((req, res) => res.status(404).send("API not found."));

server.listen(3000, () => {
  console.log("Server is listening at port 3000");
  connectToDB();
});
