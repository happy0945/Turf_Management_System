
import express from "express";
import {registerUser, loginUser, logoutUser,adminRegister, deleteProfile } from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const authRouter = express.Router();


// User Authentication Router
authRouter.post("/register",registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout",userMiddleware,logoutUser)
authRouter.post("/admin/register",userMiddleware,adminMiddleware,adminRegister);
authRouter.delete('/delete',userMiddleware,adminMiddleware,deleteProfile)


export default authRouter