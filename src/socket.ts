import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import Message from "./models/messages-model";
import Channel from "./models/chennel-model";
import User from "./models/user.model";
import { MessagesTypes } from "./@types/constants";
import { config } from "./config/app-config";

const SetupSocket = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [config.FRONTEND_ORIGIN, config.LOCAL_ORGIN],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
  });

  // ✅ Multi-device support: userId -> array of socketIds
  const userSocketMap = new Map<string, string[]>();

  /** --------------------------
   * Utility: Add user socket
   --------------------------- */
  const addUserSocket = (userId: string, socketId: string) => {
    const sockets = userSocketMap.get(userId) || [];
    if (!sockets.includes(socketId)) {
      userSocketMap.set(userId, [...sockets, socketId]);
    }
  };

  /** --------------------------
   * Utility: Remove user socket
   --------------------------- */
  const removeUserSocket = (userId: string, socketId: string) => {
    const sockets = userSocketMap.get(userId) || [];
    const updated = sockets.filter((id) => id !== socketId);
    if (updated.length > 0) {
      userSocketMap.set(userId, updated);
    } else {
      userSocketMap.delete(userId);
    }
  };

  /** --------------------------
   * Disconnect handler
   --------------------------- */
  const disconnect = (socket: Socket) => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    for (const [userId, sockets] of userSocketMap.entries()) {
      if (sockets.includes(socket.id)) {
        removeUserSocket(userId, socket.id);
        console.log(`Removed socket for user: ${userId}`);
        break;
      }
    }
  };

  /** --------------------------
   * Send private message
   --------------------------- */
  const sendMessage = async (message: MessagesTypes) => {
    try {
      const createdMessage = await Message.create(message);

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName profileImage bgColor")
        .populate(
          "recipient",
          "id email firstName lastName profileImage bgColor"
        );

      if (!messageData) return;

      // Notify sender + recipient (multi-device)
      const senderSockets = userSocketMap.get(message.sender) || [];
      const recipientSockets = userSocketMap.get(message.recipient) || [];

      [...senderSockets, ...recipientSockets].forEach((socketId) => {
        io.to(socketId).emit("recieveMessage", messageData);
      });
    } catch (err) {
      console.error("Error in sendMessage:", err);
    }
  };

  /** --------------------------
   * Send channel message
   --------------------------- */
  const sendChannelMessage = async (message: MessagesTypes) => {
    try {
      const { channelId, sender, content, messageType, fileUrl } = message;

      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content,
        messageType,
        timestamp: new Date(),
        fileUrl,
      });

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName profileImage bgColor")
        .exec();

      if (!messageData) return;

      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });

      const channel = await Channel.findById(channelId).populate("members");

      if (channel && channel.members) {
        const finalData = { ...messageData.toObject(), channel };

        channel.members.forEach((member) => {
          const memberSockets = userSocketMap.get(member._id.toString()) || [];
          memberSockets.forEach((socketId) => {
            io.to(socketId).emit("recieve-channel-message", finalData);
          });
        });

        // Notify channel admin
        if (channel.admin) {
          const adminSockets =
            userSocketMap.get(channel.admin._id.toString()) || [];
          adminSockets.forEach((socketId) => {
            io.to(socketId).emit("recieve-channel-message", finalData);
          });
        }
      }
    } catch (err) {
      console.error("Error in sendChannelMessage:", err);
    }
  };

  /** --------------------------
   * Socket.IO connection
   --------------------------- */
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string | undefined;

    if (userId) {
      addUserSocket(userId, socket.id);
      console.log(`✅ User connected: ${userId} (${socket.id})`);
    } else {
      console.log("⚠️ userId not provided during connection");
    }

    // Typing event
    socket.on("typing", async ({ recipientId }) => {
      if (!recipientId) return;

      const recipientSockets = userSocketMap.get(recipientId) || [];
      const sender = await User.findById(userId).select(
        "firstName lastName profileImage"
      );

      if (sender) {
        recipientSockets.forEach((socketId) => {
          io.to(socketId).emit("typing", {
            senderId: userId,
            firstName: sender.firstName,
            lastName: sender.lastName,
            profileImage: sender.profileImage,
          });
        });
      }
    });

    // Stop typing event
    socket.on("stop-typing", ({ recipientId }) => {
      if (!recipientId) return;

      const recipientSockets = userSocketMap.get(recipientId) || [];
      recipientSockets.forEach((socketId) => {
        io.to(socketId).emit("stop-typing", { senderId: userId });
      });
    });

    // Message events
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);

    // Disconnect
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default SetupSocket;

// import { Server } from "http";
// import { Server as SockeIOServer, Socket } from "socket.io";
// import { DefaultEventsMap } from "socket.io/dist/typed-events";
// import Message from "./models/messages-model";
// import Channel from "./models/chennel-model";
// import { create } from "domain";
// import User from "./models/user.model";
// import { MessagesTypes } from "./@types/constants";

// const SetupSocket = (server: Server) => {
//   const io = new SockeIOServer(server, {
//     cors: {
//       origin: [
//         "https://chat-app-client-rose.vercel.app", // ✅ Frontend URL
//         "http://localhost:3000",
//       ],
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//     transports: ["websocket", "polling"], // ✅ Ensures stable connection
//     allowEIO3: true, // ✅ Allow legacy support
//   });

//   const userSocketMap = new Map();

//   const disconnect = (socket: Socket) => {
//     console.log(`❌ User disconnected: ${socket.id}`);

//     for (const [userId, socketId] of userSocketMap.entries()) {
//       if (socketId === socket.id) {
//         console.log(`Removing user ${userId} from active sockets.`);
//         userSocketMap.delete(userId);
//         break;
//       }
//     }
//   };

//   // Function for sending the message from server to client
//   const sendMessage = async (message: MessagesTypes) => {
//     const senderSocketId = userSocketMap.get(message.sender);
//     const recipientSocketId = userSocketMap.get(message.recipient);

//     const createdMessage = await Message.create(message);

//     const messageData = await Message.findById(createdMessage._id)
//       .populate("sender", "id email firstName lastName profileImage bgColor")
//       .populate(
//         "recipient",
//         "id email firstName lastName profileImage bgColor"
//       );

//     if (recipientSocketId) {
//       io.to(recipientSocketId).emit("recieveMessage", messageData);
//     }

//     if (senderSocketId) {
//       io.to(senderSocketId).emit("recieveMessage", messageData);
//     }
//   };

//   const sendChannelMessage = async (message: MessagesTypes) => {
//     const { channelId, sender, content, messageType, fileUrl } = message;

//     const createdMessage = await Message.create({
//       sender,
//       recipient: null,
//       content,
//       messageType,
//       timestamp: new Date(),
//       fileUrl,
//     });

//     const messageData = await Message.findById(createdMessage._id)
//       .populate("sender", "id email firstName lastName profileImage bgColor")
//       .exec();

//     if (!messageData) {
//       console.error("Message not found after creation");
//       return;
//     }

//     await Channel.findByIdAndUpdate(channelId, {
//       $push: { messages: createdMessage._id },
//     });

//     const channel = await Channel.findById(channelId).populate("members");

//     if (messageData) {
//       const finalData = { ...messageData.toObject(), channel };

//       if (channel && channel.members) {
//         channel.members.forEach((member) => {
//           const memberSocketId = userSocketMap.get(member._id.toString());
//           if (memberSocketId) {
//             io.to(memberSocketId).emit("recieve-channel-message", finalData);
//           }
//         });

//         const adminSocketId = userSocketMap.get(channel.admin._id.toString());
//         if (adminSocketId) {
//           io.to(adminSocketId).emit("recieve-channel-message", finalData);
//         }
//       }
//     }
//   };

//   io.on("connection", (socket) => {
//     const userId = socket.handshake.query.userId;

//     if (userId) {
//       userSocketMap.set(userId, socket.id);
//       console.log(`User connected: ${userId} with Socket ID: ${socket.id}`);
//     } else {
//       console.log("Userid Not provided during the connection");
//     }

//     // Handle typing event
//     socket.on("typing", async ({ recipientId }) => {
//       try {
//         if (!recipientId) return;

//         const recipientSocketId = userSocketMap.get(recipientId);
//         if (!recipientSocketId) return;

//         const sender = await User.findById(userId).select(
//           "firstName lastName profileImage"
//         );

//         if (sender) {
//           io.to(recipientSocketId).emit("typing", {
//             senderId: userId, // ✅ Now frontend knows who is typing
//             // recipientId,
//             firstName: sender.firstName,
//             lastName: sender.lastName,
//             profileImage: sender.profileImage,
//           });
//         }
//       } catch (error) {
//         console.error("Error handling typing event:", error);
//       }
//     });

//     // Handle stop typing event
//     socket.on("stop-typing", ({ recipientId }) => {
//       if (!recipientId) return;

//       const recipientSocketId = userSocketMap.get(recipientId);
//       if (recipientSocketId) {
//         io.to(recipientSocketId).emit("stop-typing", { senderId: userId }); // ✅ Send `senderId` to remove only that user
//       }
//     });

//     socket.on("sendMessage", sendMessage);
//     socket.on("send-channel-message", sendChannelMessage);

//     socket.on("disconnect", () => disconnect(socket));
//   });
// };

// export default SetupSocket;
