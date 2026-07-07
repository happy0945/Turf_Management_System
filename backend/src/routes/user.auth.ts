
import express from "express";
import { registerUser } from "../controllers/user.authent.js";
import { loginUser } from "../controllers/user.authent.js";

const authRouter = express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login", loginUser);