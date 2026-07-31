import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/user.auth.js";
import turfRouter from "./routes/turf.routes.js";
import bookingRouter from "./routes/booking.routes.js"
import webhookRouter from "./routes/webhook.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));

// use for decode json data

app.use('/webhooks',webhookRouter)

app.use(express.json());
// use for decode cookie
app.use(cookieParser());
// use for decode data from url
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/auth',authRouter)
app.use('/turf',turfRouter)
app.use('/booking',bookingRouter)


// error handler 
app.use(errorHandler)


export {app}