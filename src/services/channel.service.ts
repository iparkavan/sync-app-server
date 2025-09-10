import mongoose from "mongoose";
import Channel from "../models/chennel-model";
import User from "../models/user.model";
import { NotFoundException } from "../utils/appError";

export const createChannelService = async (
  name: string,
  members: string[],
  userId: string
) => {
  const admin = await User.findById(userId);
  if (!admin) throw new NotFoundException("Admin not found");

  const validMembers = await User.find({ _id: { $in: members } });

  if (validMembers.length !== members.length) {
    throw new NotFoundException("Some members are not found");
  }

  const newChannel = new Channel({
    name,
    members,
    admin: userId,
  });

  await newChannel.save();

  return { newChannel };
};

export const getUserChannelsService = async (
  userId: mongoose.Types.ObjectId
) => {
  const channels = await Channel.find({
    $or: [{ admin: userId }, { members: userId }],
  }).sort({ updateAt: -1 });

  return { channels };
};

export const getChannelMessagesService = async (channelId: string) => {
  const channel = await Channel.findById(channelId).populate({
    path: "messages",
    populate: {
      path: "sender",
      select: "firstName lastName email _id bgColor profileImage",
    },
  });

  if (!channel) {
    throw new NotFoundException("Channel not found");
  }

  const messages = channel?.messages;

  return { messages };
};
