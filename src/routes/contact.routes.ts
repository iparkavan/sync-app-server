import { Router } from "express";
import { verifyToken } from "../middlewares/isAuthenticated.middleware";
import {
  getAllContactsController,
  getContactsForDmListController,
  searchContactsController,
} from "../controllers/contacts.controller";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContactsController);

contactRoutes.get(
  "/get-contact-for-dm",
  verifyToken,
  getContactsForDmListController
);

contactRoutes.get("/get-all-contacts", verifyToken, getAllContactsController);

export default contactRoutes;
