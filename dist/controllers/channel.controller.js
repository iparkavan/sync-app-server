"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelMessagesController = exports.getUserChannelsController = exports.createChannelController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_config_1 = require("../config/http.config");
const channel_service_1 = require("../services/channel.service");
const appError_1 = require("../utils/appError");
const createChannelController = async (req, res, next) => {
    const { name, members } = req.body;
    if (!name || !members)
        throw new appError_1.BadRequestException("Name and members are mandatory");
    const userId = req.userId;
    if (!userId) {
        throw new appError_1.UnauthorizedException("User not authenticated");
    }
    const { newChannel } = await (0, channel_service_1.createChannelService)(name, members, userId);
    return res
        .status(http_config_1.HTTPSTATUS.CREATED)
        .json({ message: "Channel created successfully", channel: newChannel });
};
exports.createChannelController = createChannelController;
const getUserChannelsController = async (req, res, next) => {
    const userId = new mongoose_1.default.Types.ObjectId(req.userId);
    const { channels } = await (0, channel_service_1.getUserChannelsService)(userId);
    res
        .status(http_config_1.HTTPSTATUS.OK)
        .json({ message: "Channels fetched successfully", channels });
};
exports.getUserChannelsController = getUserChannelsController;
const getChannelMessagesController = async (req, res, next) => {
    const { channelId } = req.params;
    const { messages } = await (0, channel_service_1.getChannelMessagesService)(channelId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({ messages });
};
exports.getChannelMessagesController = getChannelMessagesController;
