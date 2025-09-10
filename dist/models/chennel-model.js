"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const channelSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [{ type: mongoose_1.default.Schema.ObjectId, ref: "User", required: true }],
    admin: { type: mongoose_1.default.Schema.ObjectId, ref: "User", required: true },
    messages: [
        { type: mongoose_1.default.Schema.ObjectId, ref: "Message", required: false },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});
channelSchema.pre("save", async function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});
channelSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});
const Channel = mongoose_1.default.model("Channel", channelSchema);
exports.default = Channel;
