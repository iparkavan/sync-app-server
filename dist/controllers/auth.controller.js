"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfoController = exports.signUpController = exports.updateProfileSetupController = exports.loginController = void 0;
const http_config_1 = require("../config/http.config");
const auth_service_1 = require("../services/auth.service");
const auth_validation_1 = require("../validations/auth.validation");
const loginController = async (req, res, next) => {
    const body = auth_validation_1.loginSchema.parse({ ...req.body });
    const { user, token } = await (0, auth_service_1.loginService)(body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User logged in successfully",
        user,
        token,
    });
};
exports.loginController = loginController;
const updateProfileSetupController = async (req, res, next) => {
    const body = auth_validation_1.profileSetupSchema.parse({ ...req.body });
    if (!req.userId) {
        return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
            message: "User ID is required for profile setup",
        });
    }
    const { userInfo } = await (0, auth_service_1.updateProfileSetupService)(body, req.userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User Profile Updated successfully",
        userInfo,
    });
};
exports.updateProfileSetupController = updateProfileSetupController;
const signUpController = async (req, res, next) => {
    const body = auth_validation_1.loginSchema.parse({ ...req.body });
    const { user, token } = await (0, auth_service_1.signUpService)(body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "User created successfully",
        user,
        token,
    });
};
exports.signUpController = signUpController;
const userInfoController = async (req, res, next) => {
    const userInfo = await (0, auth_service_1.userInfoService)(req.userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Current userInfo  fetched successfully",
        userInfo,
    });
};
exports.userInfoController = userInfoController;
// export const logoutController: ExpressHandler = async (req, res, next) => {};
