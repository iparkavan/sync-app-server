"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelMessagesService = exports.getUserChannelsService = exports.createChannelService = void 0;
const chennel_model_1 = __importDefault(require("../models/chennel-model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_1 = require("../utils/appError");
const createChannelService = async (name, members, userId) => {
    const admin = await user_model_1.default.findById(userId);
    if (!admin)
        throw new appError_1.NotFoundException("Admin not found");
    const validMembers = await user_model_1.default.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
        throw new appError_1.NotFoundException("Some members are not found");
    }
    const newChannel = new chennel_model_1.default({
        name,
        members,
        admin: userId,
    });
    await newChannel.save();
    return { newChannel };
};
exports.createChannelService = createChannelService;
const getUserChannelsService = async (userId) => {
    const channels = await chennel_model_1.default.find({
        $or: [{ admin: userId }, { members: userId }],
    }).sort({ updateAt: -1 });
    return { channels };
};
exports.getUserChannelsService = getUserChannelsService;
const getChannelMessagesService = async (channelId) => {
    const channel = await chennel_model_1.default.findById(channelId).populate({
        path: "messages",
        populate: {
            path: "sender",
            select: "firstName lastName email _id bgColor profileImage",
        },
    });
    if (!channel) {
        throw new appError_1.NotFoundException("Channel not found");
    }
    const messages = channel?.messages;
    return { messages };
};
exports.getChannelMessagesService = getChannelMessagesService;
