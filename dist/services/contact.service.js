"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllContactsService = exports.getContactsForDmListService = exports.searchContactsService = void 0;
const messages_model_1 = __importDefault(require("../models/messages-model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const searchContactsService = async (searchTerms, userId) => {
    if (searchTerms === undefined || searchTerms === null) {
        throw new Error("Search Term is Required");
    }
    const sanitizedSearchTerm = searchTerms.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await user_model_1.default.find({
        $and: [
            { _id: { $ne: userId } },
            { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
        ],
    });
    return { contacts };
};
exports.searchContactsService = searchContactsService;
const getContactsForDmListService = async (userId) => {
    const contacts = await messages_model_1.default.aggregate([
        {
            $match: {
                $or: [{ sender: userId }, { recipient: userId }],
            },
        },
        {
            $sort: { timestamp: -1 },
        },
        {
            $group: {
                _id: {
                    $cond: {
                        if: { $eq: ["$sender", userId] },
                        then: "$recipient",
                        else: "$sender",
                    },
                },
                lastMessageTime: { $first: "$timestamp" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "contactInfo",
            },
        },
        { $unwind: "$contactInfo" },
        {
            $project: {
                _id: 1,
                lastMessageTime: 1,
                email: "$contactInfo.email",
                firstName: "$contactInfo.firstName",
                lastName: "$contactInfo.lastName",
                profileImage: "$contactInfo.profileImage",
                bgColor: "$contactInfo.bgColor",
            },
        },
        {
            $sort: { lastMessageTime: -1 },
        },
    ]);
    // console.log(userId, contacts);
    return { contacts };
};
exports.getContactsForDmListService = getContactsForDmListService;
const getAllContactsService = async (userId) => {
    const users = user_model_1.default.find({ _id: { $ne: userId } }, "firstName, lastName, _id, email");
    const contacts = (await users).map((user) => ({
        label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
        value: user._id,
    }));
    return { contacts };
};
exports.getAllContactsService = getAllContactsService;
