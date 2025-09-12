import { ExpressHandler } from "../@types/constants";
import { HTTPSTATUS } from "../config/http.config";
import {
  addProfileImageService,
  loginService,
  removeProfileImageService,
  signUpService,
  updateProfileSetupService,
  userInfoService,
} from "../services/auth.service";
import { BadRequestException } from "../utils/appError";
import {
  loginSchema,
  profileSetupSchema,
} from "../validations/auth.validation";

export const loginController: ExpressHandler = async (req, res, next) => {
  const body = loginSchema.parse({ ...req.body });

  const { user, token } = await loginService(body);

  return res.status(HTTPSTATUS.OK).json({
    message: "User logged in successfully",
    user,
    token,
  });
};

export const updateProfileSetupController: ExpressHandler = async (
  req,
  res,
  next
) => {
  const body = profileSetupSchema.parse({ ...req.body });

  if (!req.userId) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "User ID is required for profile setup",
    });
  }

  const { userInfo } = await updateProfileSetupService(body, req.userId);

  return res.status(HTTPSTATUS.OK).json({
    message: "User Profile Updated successfully",
    userInfo,
  });
};

export const signUpController: ExpressHandler = async (req, res, next) => {
  const body = loginSchema.parse({ ...req.body });

  const { user, token } = await signUpService(body);

  return res.status(HTTPSTATUS.CREATED).json({
    message: "User created successfully",
    user,
    token,
  });
};

export const userInfoController: ExpressHandler = async (req, res, next) => {
  const userInfo = await userInfoService(req.userId!);

  return res.status(HTTPSTATUS.OK).json({
    message: "Current userInfo  fetched successfully",
    userInfo,
  });
};

export const addProfileImageController: ExpressHandler = async (
  req,
  res,
  next
) => {
  if (!req.file) {
    throw new BadRequestException("Image File is mandatrory");
  }

  const { profileImage } = await addProfileImageService(req.file, req.userId!);

  return res.status(HTTPSTATUS.OK).json({
    profileImage,
  });
};

export const removeProfileImageController: ExpressHandler = async (
  req,
  res,
  next
) => {
  await removeProfileImageService(req.userId!);
};

// export const logoutController: ExpressHandler = async (req, res, next) => {};
