"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.profileSetupSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z
    .string()
    .trim()
    .email("Invalid email address")
    .min(1)
    .max(255);
exports.passwordSchema = zod_1.z.string().trim().min(4);
exports.profileSetupSchema = zod_1.z.object({
    firstName: zod_1.z.string().trim().min(1).max(225),
    lastName: zod_1.z.string().trim().min(1).max(225),
    bgColor: zod_1.z.number(),
    // email: emailSchema,
    // password: passwordSchema,
});
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
});
