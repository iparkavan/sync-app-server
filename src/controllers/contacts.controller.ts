import mongoose from "mongoose";
import { ExpressHandler } from "../@types/constants";
import { HTTPSTATUS } from "../config/http.config";
import {
  getAllContactsService,
  getContactsForDmListService,
  searchContactsService,
} from "../services/contact.service";
import { UnauthorizedException } from "../utils/appError";

export const searchContactsController: ExpressHandler = async (
  req,
  res,
  next
) => {
  const { searchTerms } = req.body;

  if (!req.userId) {
    throw new UnauthorizedException("User not authenticated");
  }

  const { contacts } = await searchContactsService(searchTerms, req.userId!);

  return res
    .status(HTTPSTATUS.OK)
    .json({ message: "Contacts fetched Successfully", contacts });
};

export const getContactsForDmListController: ExpressHandler = async (
  req,
  res,
  next
) => {
  let userId: mongoose.Types.ObjectId | undefined;

  if (req.userId) {
    userId = new mongoose.Types.ObjectId(req.userId);
  }

  const { contacts } = await getContactsForDmListService(userId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Contacts for DM list fetched successfully",
    contacts,
  });
};

export const getAllContactsController: ExpressHandler = async (
  req,
  res,
  next
) => {
  if (!req.userId) {
    throw new UnauthorizedException("User not authenticated");
  }

  const { contacts } = await getAllContactsService(req.userId!);

  return res.status(HTTPSTATUS.OK).json({
    message: "All contacts fetched successfully",
    contacts,
  });
};
