"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const isAuthenticated_middleware_1 = require("../middlewares/isAuthenticated.middleware");
const message_controller_1 = require("../controllers/message.controller");
const messageRoutes = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: "src/uploads/files/" });
messageRoutes.post("/get-messages", isAuthenticated_middleware_1.verifyToken, message_controller_1.getMessagesController);
messageRoutes.post("/upload-file", isAuthenticated_middleware_1.verifyToken, upload.single("file"), message_controller_1.uploadFilesController);
exports.default = messageRoutes;
