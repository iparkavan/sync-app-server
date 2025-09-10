import { ExpressHandler } from "../@types/constants";
import { HTTPSTATUS } from "../config/http.config";
import {
  getMessagesService,
  uploadFilesService,
} from "../services/message.service";

export const getMessagesController: ExpressHandler = async (req, res, next) => {
  const user1 = req.userId;

  if (!user1) {
    throw new Error("User not authenticated");
  }

  const { user2 } = req.body;

  if (!user1 || !user2) {
    throw new Error("Both userId's are required");
  }

  const messages = await getMessagesService(user1, user2);

  return res.status(HTTPSTATUS.OK).json(messages);
};

export const uploadFilesController: ExpressHandler = async (req, res, next) => {
  if (!req.file) {
    return res.status(HTTPSTATUS.BAD_REQUEST).send("File is required");
  }

  const fileName = await uploadFilesService(req.file);

  return res.status(HTTPSTATUS.OK).json({ filePath: fileName });
};
