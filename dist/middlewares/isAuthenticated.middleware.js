"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("You are not authenticated!");
    }
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err)
            return res.status(403).send("Token is not valid");
        const payload = decoded;
        req.userId = payload.userId || ""; // 👈 attaches userId to request
        next();
    });
};
exports.verifyToken = verifyToken;
