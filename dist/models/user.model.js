"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = require("bcryptjs");
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
    bgColor: {
        type: Number,
        default: 0,
    },
});
// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await (0, bcryptjs_1.genSalt)();
        this.password = await (0, bcryptjs_1.hash)(this.password, salt);
    }
    next();
});
userSchema.methods.omitPassword = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
