import express from "express";
import { registerUser, loginUser, logoutUser, adminRegister, registerOwner, deleteProfile, getProfile, updateProfile } from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const authRouter = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

// ─── Protected routes ─────────────────────────────────────────────────────────
authRouter.post("/logout", userMiddleware, logoutUser);
authRouter.get("/profile", userMiddleware, getProfile);
authRouter.patch("/profile", userMiddleware, updateProfile);

// ─── Admin-only routes ────────────────────────────────────────────────────────
authRouter.post("/admin/register", userMiddleware, adminMiddleware, adminRegister);
authRouter.post("/owner/register", userMiddleware, adminMiddleware, registerOwner);
authRouter.delete('/delete', userMiddleware, adminMiddleware, deleteProfile);

export default authRouter;