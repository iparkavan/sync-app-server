"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesService = exports.getMessagesService = void 0;
const fs_1 = require("fs");
const messages_model_1 = __importDefault(require("../models/messages-model"));
const getMessagesService = async (user1, user2) => {
    const messages = await messages_model_1.default.find({
        $or: [
            { sender: user1, recipient: user2 },
            { sender: user2, recipient: user1 },
        ],
    }).sort({ timestamp: 1 });
    return { messages };
};
exports.getMessagesService = getMessagesService;
const uploadFilesService = async (file) => {
    const date = Date.now();
    const fileDir = `src/uploads/files/${date}`;
    const fileName = `${fileDir}/${file.originalname}`;
    (0, fs_1.mkdirSync)(fileDir, { recursive: true });
    (0, fs_1.renameSync)(file.path, fileName);
    return fileName;
};
exports.uploadFilesService = uploadFilesService;
