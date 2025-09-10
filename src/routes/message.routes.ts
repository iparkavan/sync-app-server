import Router from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/isAuthenticated.middleware";
import {
  getMessagesController,
  uploadFilesController,
} from "../controllers/message.controller";

const messageRoutes = Router();
const upload = multer({ dest: "src/uploads/files/" });

messageRoutes.post("/get-messages", verifyToken, getMessagesController);

messageRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFilesController
);

export default messageRoutes;
