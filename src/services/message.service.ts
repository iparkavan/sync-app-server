import { mkdirSync, renameSync } from "fs";
import Message from "../models/messages-model";

export const getMessagesService = async (user1: string, user2: string) => {
  const messages = await Message.find({
    $or: [
      { sender: user1, recipient: user2 },
      { sender: user2, recipient: user1 },
    ],
  }).sort({ timestamp: 1 });

  return { messages };
};

export const uploadFilesService = async (file: Express.Multer.File) => {
  const date = Date.now();
  const fileDir = `src/uploads/files/${date}`;
  const fileName = `${fileDir}/${file.originalname}`;

  mkdirSync(fileDir, { recursive: true });

  renameSync(file.path, fileName);

  return fileName;
};
