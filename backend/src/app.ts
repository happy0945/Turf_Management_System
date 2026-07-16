import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/user.auth.js";
import cors from "cors";
const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));

// use for decode json data
app.use(express.json());
// use for decode cookie
app.use(cookieParser());
// use for decode data from url
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/auth',authRouter)



export {app}