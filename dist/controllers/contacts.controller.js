"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllContactsController = exports.getContactsForDmListController = exports.searchContactsController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_config_1 = require("../config/http.config");
const contact_service_1 = require("../services/contact.service");
const appError_1 = require("../utils/appError");
const searchContactsController = async (req, res, next) => {
    const { searchTerms } = req.body;
    if (!req.userId) {
        throw new appError_1.UnauthorizedException("User not authenticated");
    }
    const { contacts } = await (0, contact_service_1.searchContactsService)(searchTerms, req.userId);
    return res
        .status(http_config_1.HTTPSTATUS.OK)
        .json({ message: "Contacts fetched Successfully", contacts });
};
exports.searchContactsController = searchContactsController;
const getContactsForDmListController = async (req, res, next) => {
    let userId;
    if (req.userId) {
        userId = new mongoose_1.default.Types.ObjectId(req.userId);
    }
    const { contacts } = await (0, contact_service_1.getContactsForDmListService)(userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Contacts for DM list fetched successfully",
        contacts,
    });
};
exports.getContactsForDmListController = getContactsForDmListController;
const getAllContactsController = async (req, res, next) => {
    if (!req.userId) {
        throw new appError_1.UnauthorizedException("User not authenticated");
    }
    const { contacts } = await (0, contact_service_1.getAllContactsService)(req.userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "All contacts fetched successfully",
        contacts,
    });
};
exports.getAllContactsController = getAllContactsController;
