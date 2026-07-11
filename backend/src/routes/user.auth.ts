
import express from "express";
import {registerUser, loginUser, logoutUser,adminRegister } from "../controllers/user.authent.js";
import userMiddleware from "../middlewares/userMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout",userMiddleware,logoutUser)
authRouter.post("/admin/register",adminMiddleware,adminRegister);

export default authRouter