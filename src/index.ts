import "dotenv/config";
import express from "express";
import { createServer, Server } from "http";
import cors from "cors";

import { config } from "./config/app-config";
import connectDatabase from "./config/database-config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import "./config/passport.config";

// Routes
import authRoutes from "./routes/auth.routes";
import contactRoutes from "./routes/contact.routes";
import messageRoutes from "./routes/message.routes";

// Socket setup
import SetupSocket from "./socket";
import channelRoutes from "./routes/channel.routes";

const app = express();
const BASE_PATH = config.BASE_PATH;

/** --------------------------
 *  Middleware
 --------------------------- */
const allowedOrigins = [
  "https://sync-app-server.onrender.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/src/uploads/profiles", express.static("src/uploads/profiles"));
app.use("/src/uploads/files", express.static("src/uploads/files"));

app.use(express.json());

/** --------------------------
 *  Routes
 --------------------------- */
app.use(`${BASE_PATH}/auth`, authRoutes);

app.use(`${BASE_PATH}/contacts`, contactRoutes);

app.use(`${BASE_PATH}/messages`, messageRoutes);

app.use(`${BASE_PATH}/channel`, channelRoutes);

// Global error handler
app.use(errorHandler);

/** --------------------------
 *  Server + Socket.IO
 --------------------------- */
const server: Server = createServer(app);

server.listen(config.PORT, async () => {
  console.log(
    `✅ Server is listening on port ${config.PORT} in ${config.NODE_ENV}`
  );
  await connectDatabase();
});

// Attach socket server
SetupSocket(server);

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
