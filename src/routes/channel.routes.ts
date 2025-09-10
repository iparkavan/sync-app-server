import { Router } from "express";
import { verifyToken } from "../middlewares/isAuthenticated.middleware";
import {
  createChannelController,
  getChannelMessagesController,
  getUserChannelsController,
} from "../controllers/channel.controller";

const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannelController);

channelRoutes.get("/get-user-channels", verifyToken, getUserChannelsController);

channelRoutes.get(
  "/get-channel-messages/:channelId",
  verifyToken,
  getChannelMessagesController
);

export default channelRoutes;
