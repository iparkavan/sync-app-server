import { compare } from "bcryptjs";
import User from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/appError";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email: string, userId: string) => {
  const JWT_KEY = process.env.JWT_KEY as string;
  return jwt.sign({ email, userId }, JWT_KEY, { expiresIn: maxAge });
};

export const loginService = async (body: {
  email: string;
  password: string;
}) => {
  const { email, password } = body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const auth = await compare(password, user.password);

  if (!auth) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const token = createToken(email, user.id);

  return { user: user.omitPassword(), token };
};

export const updateProfileSetupService = async (
  body: {
    firstName: string;
    lastName: string;
    bgColor: number;
  },
  userId: string
) => {
  const { firstName, lastName, bgColor } = body;

  const userInfo = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, bgColor, profileSetup: true },
    { new: true, runValidators: true }
  );

  return { userInfo: userInfo?.omitPassword() };
};

export const signUpService = async (body: {
  email: string;
  password: string;
}) => {
  const { email, password } = body;
  const existingUser = await User.findOne({ email });

  if (existingUser)
    throw new NotFoundException(
      "You have already registered your account, try signin"
    );

  const user = await User.create({ email, password });

  if (!user) {
    throw new UnauthorizedException("Error creating user");
  }

  const token = createToken(email, user.id);

  return { user: user.omitPassword(), token };
};

export const userInfoService = async (userId: string) => {
  const userInfo = await User.findById(userId);

  if (!userInfo)
    throw new NotFoundException("User with the given id not found");

  return userInfo.omitPassword();

  // return res.status(200).json({
  //   id: userInfo.id,
  //   email: userInfo.email,
  //   profileSetup: userInfo.profileSetup,
  //   firstName: userInfo.firstName,
  //   lastName: userInfo.lastName,
  //   profileImage: userInfo.profileImage,
  //   bgColor: userInfo.bgColor,
  // });
};

// import mongoose from "mongoose";
// import UserModel from "../models/user.model";
// import AccountModel from "../models/account.model";
// import RoleModel from "../models/roles-permission.model";
// import { Roles } from "../enums/role.enum";
// import {
//   BadRequestException,
//   NotFoundException,
//   UnauthorizedException,
// } from "../utils/appError";
// import MemberModel from "../models/member.model";
// import { ProviderEnum } from "../enums/account-provider.enum";
// import WorkspaceModel from "../models/workspace.model";

// export const loginOrCreateAccountService = async (data: {
//   provider: string;
//   displayName: string;
//   providerId: string;
//   picture?: string;
//   email?: string;
// }) => {
//   const { provider, providerId, displayName, picture, email } = data;

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();
//     let user = await UserModel.findOne({ email }).session(session);

//     if (!user) {
//       user = new UserModel({
//         email,
//         name: displayName,
//         profilePicture: picture || null,
//       });

//       await user.save({ session });

//       const account = new AccountModel({
//         userId: user._id,
//         provider,
//         providerId,
//       });

//       await account.save({ session });

//       const workspace = new WorkspaceModel({
//         name: `My Workspace`,
//         description: `Workspace created by ${user.name}`,
//         owner: user._id,
//       });

//       await workspace.save({ session });

//       const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(
//         session
//       );

//       if (!ownerRole) {
//         throw new NotFoundException(`Owner role not found`);
//       }

//       const member = new MemberModel({
//         userId: user._id,
//         workspaceId: workspace._id,
//         role: ownerRole._id,
//         joinedAt: new Date(),
//       });

//       await member.save({ session });

//       user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

//       await user.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();
//     console.log(`End Session...`);

//     return { user };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

// export const registerUserService = async (body: {
//   email: string;
//   name: string;
//   password: string;
// }) => {
//   const { email, name, password } = body;

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const existingUser = await UserModel.findOne({ email }).session(session);

//     if (existingUser) {
//       throw new BadRequestException("Email already exist");
//     }

//     const user = new UserModel({
//       email,
//       name,
//       password,
//     });

//     await user.save({ session });

//     const account = new AccountModel({
//       userId: user._id,
//       provider: ProviderEnum.EMAIL,
//       providerId: email,
//     });

//     await account.save({ session });

//     const workspace = new WorkspaceModel({
//       name: `My Workspace`,
//       description: `Workspace created by ${user.name}`,
//       owner: user._id,
//     });

//     await workspace.save({ session });

//     const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(
//       session
//     );

//     if (!ownerRole) {
//       throw new NotFoundException(`Owner role not found`);
//     }

//     const member = new MemberModel({
//       userId: user._id,
//       workspaceId: workspace._id,
//       role: ownerRole._id,
//       joinedAt: new Date(),
//     });

//     await member.save({ session });

//     user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

//     await user.save({ session });
//     await session.commitTransaction();
//     session.endSession();
//     console.log(`End Session...`);

//     return { user: user._id, workspace: workspace._id };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

// export const verifyUserService = async ({
//   email,
//   password,
//   provider = ProviderEnum.EMAIL,
// }: {
//   email: string;
//   password: string;
//   provider?: string;
// }) => {
//   const account = await AccountModel.findOne({ provider, providerId: email });

//   if (!account) {
//     throw new NotFoundException("Invalid email or password");
//   }

//   const user = await UserModel.findById(account.userId);

//   if (!user) {
//     throw new NotFoundException("User not found for the given account Id");
//   }

//   const isMatch = await user.comparePassword(password);

//   if (!isMatch) {
//     throw new UnauthorizedException("Invalid email or password");
//   }

//   return user.omitPassword();
// };
