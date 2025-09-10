import mongoose from "mongoose";
import Message from "../models/messages-model";
import User from "../models/user.model";

export const searchContactsService = async (
  searchTerms: string,
  userId: string
) => {
  if (searchTerms === undefined || searchTerms === null) {
    throw new Error("Search Term is Required");
  }

  const sanitizedSearchTerm = searchTerms.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(sanitizedSearchTerm, "i");

  const contacts = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
    ],
  });

  return { contacts };
};

export const getContactsForDmListService = async (
  userId: mongoose.Types.ObjectId | undefined
) => {
  const contacts = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { recipient: userId }],
      },
    },
    {
      $sort: { timestamp: -1 },
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ["$sender", userId] },
            then: "$recipient",
            else: "$sender",
          },
        },
        lastMessageTime: { $first: "$timestamp" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "contactInfo",
      },
    },
    { $unwind: "$contactInfo" },
    {
      $project: {
        _id: 1,
        lastMessageTime: 1,
        email: "$contactInfo.email",
        firstName: "$contactInfo.firstName",
        lastName: "$contactInfo.lastName",
        profileImage: "$contactInfo.profileImage",
        bgColor: "$contactInfo.bgColor",
      },
    },
    {
      $sort: { lastMessageTime: -1 },
    },
  ]);

  // console.log(userId, contacts);

  return { contacts };
};

export const getAllContactsService = async (userId: string) => {
  const users = User.find(
    { _id: { $ne: userId } },
    "firstName, lastName, _id, email"
  );

  const contacts = (await users).map((user) => ({
    label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
    value: user._id,
  }));

  return { contacts };
};
