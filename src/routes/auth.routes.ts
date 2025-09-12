import { Router } from "express";
import {
  addProfileImageController,
  loginController,
  removeProfileImageController,
  signUpController,
  updateProfileSetupController,
  userInfoController,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/isAuthenticated.middleware";
import multer from "multer";

// const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();
const upload = multer({ dest: "src/uploads/profiles/" });

// authRoute.post(`/register`, registerUserController);
authRoutes.post(`/login`, loginController);

authRoutes.post("/signup", signUpController);

authRoutes.post("/update-profile", verifyToken, updateProfileSetupController);

authRoutes.get("/get-userinfo", verifyToken, userInfoController);

authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImageController
);

authRoutes.delete(
  "/remove-profile-image",
  verifyToken,
  removeProfileImageController
);

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

export default authRoutes;
