

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
.then(()=>{
    try {
        const server = app.listen(PORT, ()=>{
            console.log(`🚀 Server Listening at PORT : ${PORT}`)
        });

        server.on("error",(error)=>{
            console.log("Error while connecting server:",error.message)
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
        console.log("Error while connecting server:", error.message);
    } else {
        console.log("Unknown error:", error);
    }
    }
    
})