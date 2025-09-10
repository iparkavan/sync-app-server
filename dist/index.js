"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const app_config_1 = require("./config/app-config");
const database_config_1 = __importDefault(require("./config/database-config"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
require("./config/passport.config");
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
// Socket setup
const socket_1 = __importDefault(require("./socket"));
const channel_routes_1 = __importDefault(require("./routes/channel.routes"));
const app = (0, express_1.default)();
const BASE_PATH = app_config_1.config.BASE_PATH;
/** --------------------------
 *  Middleware
 --------------------------- */
// const allowedOrigins =
//   config.NODE_ENV === "production"
//     ? [config.FRONTEND_ORIGIN]
//     : [config.LOCAL_ORGIN];
const allowedOrigins = [app_config_1.config.FRONTEND_ORIGIN, app_config_1.config.LOCAL_ORIGIN];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("Blocked CORS request from origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/src/uploads/profiles", express_1.default.static("src/uploads/profiles"));
app.use("/src/uploads/files", express_1.default.static("src/uploads/files"));
app.use(express_1.default.json());
/** --------------------------
 *  Routes
 --------------------------- */
app.use(`${BASE_PATH}/auth`, auth_routes_1.default);
app.use(`${BASE_PATH}/contacts`, contact_routes_1.default);
app.use(`${BASE_PATH}/messages`, message_routes_1.default);
app.use(`${BASE_PATH}/channel`, channel_routes_1.default);
// Global error handler
app.use(errorHandler_middleware_1.errorHandler);
/** --------------------------
 *  Server + Socket.IO
 --------------------------- */
const server = (0, http_1.createServer)(app);
server.listen(app_config_1.config.PORT, async () => {
    console.log(`✅ Server is listening on port ${app_config_1.config.PORT} in ${app_config_1.config.NODE_ENV}`);
    await (0, database_config_1.default)();
});
// Attach socket server
(0, socket_1.default)(server);
// import "dotenv/config";
// import express from "express";
// import { config } from "./config/app-config";
// import connectDatabase from "./config/database-config";
// import { errorHandler } from "./middlewares/errorHandler.middleware";
// import "./config/passport.config";
// import cors from "cors";
// import authRoutes from "./routes/auth.routes";
// import contactRoutes from "./routes/contact.routes";
// import messageRoutes from "./routes/message.routes";
// import SetupSocket from "./socket";
// import { Server } from "http";
// const app = express();
// const BASE_PATH = config.BASE_PATH;
// // app.use(express.urlencoded({ extended: true }));
// // app.use(
// //   cors({
// //     origin: config.FRONTEND_ORIGIN,
// //     credentials: true,
// //   })
// // );
// const allowedOrigins = [
//   "https://chat-app-client-rose.vercel.app",
//   "http://localhost:3000",
// ];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
// app.use("/src/uploads/profiles", express.static("src/uploads/profiles"));
// app.use("/src/uploads/files", express.static("src/uploads/files"));
// app.use(express.json());
// // app.use(`${BASE_PATH}/auth`, authRoute);
// app.use(`${BASE_PATH}/auth`, authRoutes);
// app.use(`${BASE_PATH}/contacts`, contactRoutes);
// app.use(`${BASE_PATH}/messages`, messageRoutes);
// // app.use("/api/channel", channelRoutes);
// app.use(errorHandler);
// const server: Server = app.listen(config.PORT, async () => {
//   console.log(
//     `Server is listening on port ${config.PORT} in ${config.NODE_ENV}`
//   );
//   await connectDatabase();
// });
// SetupSocket(server);
