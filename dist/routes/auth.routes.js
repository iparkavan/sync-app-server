"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const isAuthenticated_middleware_1 = require("../middlewares/isAuthenticated.middleware");
// const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const authRoutes = (0, express_1.Router)();
// authRoute.post(`/register`, registerUserController);
authRoutes.post(`/login`, auth_controller_1.loginController);
authRoutes.post("/signup", auth_controller_1.signUpController);
authRoutes.post("/update-profile", isAuthenticated_middleware_1.verifyToken, auth_controller_1.updateProfileSetupController);
authRoutes.get("/get-userinfo", isAuthenticated_middleware_1.verifyToken, auth_controller_1.userInfoController);
// authRoutes.post(`/logout`, logoutController);
// authRoute.get(
//   `/google`,
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     // session: false,
//   })
// );
// authRoute.get(
//   `/google/callback`,
//   passport.authenticate(`google`, {
//     failureRedirect: failedUrl,
//   }),
//   googleLoginCallback
// );
exports.default = authRoutes;
