import express from "express";
import FriendController from "./friend.controller.js";

const friendRouter = express.Router();

const friendController = new FriendController();

export default friendRouter;
