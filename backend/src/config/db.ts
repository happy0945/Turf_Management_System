import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: DB_NAME,
        });
        console.log(`✅ MongoDB connected successfully to ${connectionInstance.connection.host}`);
    }
    catch (error: unknown) {
        if (error instanceof Error) {
        console.log("Error while connecting Database:", error.message);
    } else {
        console.log("Unknown error:", error);
    }
    process.exit(1);
    }
}

export default connectDB;