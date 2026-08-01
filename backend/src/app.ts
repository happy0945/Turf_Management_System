import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/user.auth.js";
import turfRouter from "./routes/turf.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import webhookRouter from "./routes/webhook.routes.js";
import reviewRouter from "./routes/review.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://turf-management-system-six.vercel.app",
    "https://turf-management-system-six.vercel.app/",
    process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            allowedOrigins.includes(origin.replace(/\/$/, "")) ||
            /\.vercel\.app$/.test(origin)
        ) {
            return callback(null, true);
        }
        return callback(new Error("CORS policy violation: Origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));

// Webhook router (raw body parsing where needed)
app.use('/webhooks', webhookRouter);

// JSON and URL-encoded body parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route declarations
app.use('/auth', authRouter);
app.use('/turf', turfRouter);
app.use('/booking', bookingRouter);
app.use('/review', reviewRouter);

// Global Error Handler
app.use(errorHandler);

export { app };