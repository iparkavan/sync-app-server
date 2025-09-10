"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const get_env_1 = require("../utils/get-env");
const appConfig = () => ({
    NODE_ENV: (0, get_env_1.getEnv)("NODE_ENV", "development"),
    PORT: (0, get_env_1.getEnv)("PORT", "5000"),
    BASE_PATH: (0, get_env_1.getEnv)("BASE_PATH", "/api"),
    MONGO_URI: (0, get_env_1.getEnv)("DATABASE_URL", ""),
    FRONTEND_ORIGIN: (0, get_env_1.getEnv)("FRONTEND_ORIGIN", "http://localhost:3000"),
    LOCAL_ORIGIN: (0, get_env_1.getEnv)("LOCAL_ORIGIN", "http://localhost:3000"),
    // SESSION_SECRET: getEnv("SESSION_SECRET"),
    // SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),
    // GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    // GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    // GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),
    // FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
});
exports.config = appConfig();
