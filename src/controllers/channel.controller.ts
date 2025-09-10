import mongoose from "mongoose";
import { ExpressHandler } from "../@types/constants";
import { HTTPSTATUS } from "../config/http.config";
import {
  createChannelService,
  getChannelMessagesService,
  getUserChannelsService,
} from "../services/channel.service";
import { BadRequestException, UnauthorizedException } from "../utils/appError";

export const createChannelController: ExpressHandler = async (
  req,
  res,
  next
) => {
  const { name, members } = req.body;

  if (!name || !members)
    throw new BadRequestException("Name and members are mandatory");

  const userId = req.userId;

  if (!userId) {
    throw new UnauthorizedException("User not authenticated");
  }

  const { newChannel } = await createChannelService(name, members, userId);

  return res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "Channel created successfully", channel: newChannel });
};

export const getUserChannelsController: ExpressHandler = async (
  req,
  res,
  next
) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  const { channels } = await getUserChannelsService(userId);

  res
    .status(HTTPSTATUS.OK)
    .json({ message: "Channels fetched successfully", channels });
};

export const getChannelMessagesController: ExpressHandler = async (
  req,
  res,
  next
) => {
  const { channelId } = req.params;

  const { messages } = await getChannelMessagesService(channelId);

  return res.status(HTTPSTATUS.OK).json({ messages });
};
