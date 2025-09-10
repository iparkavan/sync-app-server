"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesController = exports.getMessagesController = void 0;
const http_config_1 = require("../config/http.config");
const message_service_1 = require("../services/message.service");
const getMessagesController = async (req, res, next) => {
    const user1 = req.userId;
    if (!user1) {
        throw new Error("User not authenticated");
    }
    const { user2 } = req.body;
    if (!user1 || !user2) {
        throw new Error("Both userId's are required");
    }
    const messages = await (0, message_service_1.getMessagesService)(user1, user2);
    return res.status(http_config_1.HTTPSTATUS.OK).json(messages);
};
exports.getMessagesController = getMessagesController;
const uploadFilesController = async (req, res, next) => {
    if (!req.file) {
        return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).send("File is required");
    }
    const fileName = await (0, message_service_1.uploadFilesService)(req.file);
    return res.status(http_config_1.HTTPSTATUS.OK).json({ filePath: fileName });
};
exports.uploadFilesController = uploadFilesController;
