"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfoService = exports.signUpService = exports.updateProfileSetupService = exports.loginService = void 0;
const bcryptjs_1 = require("bcryptjs");
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_1 = require("../utils/appError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    const JWT_KEY = process.env.JWT_KEY;
    return jsonwebtoken_1.default.sign({ email, userId }, JWT_KEY, { expiresIn: maxAge });
};
const loginService = async (body) => {
    const { email, password } = body;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        throw new appError_1.NotFoundException("User not found");
    }
    const auth = await (0, bcryptjs_1.compare)(password, user.password);
    if (!auth) {
        throw new appError_1.UnauthorizedException("Invalid email or password");
    }
    const token = createToken(email, user.id);
    return { user: user.omitPassword(), token };
};
exports.loginService = loginService;
const updateProfileSetupService = async (body, userId) => {
    const { firstName, lastName, bgColor } = body;
    const userInfo = await user_model_1.default.findByIdAndUpdate(userId, { firstName, lastName, bgColor, profileSetup: true }, { new: true, runValidators: true });
    return { userInfo: userInfo?.omitPassword() };
};
exports.updateProfileSetupService = updateProfileSetupService;
const signUpService = async (body) => {
    const { email, password } = body;
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser)
        throw new appError_1.NotFoundException("You have already registered your account, try signin");
    const user = await user_model_1.default.create({ email, password });
    if (!user) {
        throw new appError_1.UnauthorizedException("Error creating user");
    }
    const token = createToken(email, user.id);
    return { user: user.omitPassword(), token };
};
exports.signUpService = signUpService;
const userInfoService = async (userId) => {
    const userInfo = await user_model_1.default.findById(userId);
    if (!userInfo)
        throw new appError_1.NotFoundException("User with the given id not found");
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
exports.userInfoService = userInfoService;
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
