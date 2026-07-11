import "./utils/env.js";
import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";
import { app } from "./app.js";



const PORT = process.env.PORT || 8000;

Promise.all([
  connectDB(),
  redisClient.connect(),
])
  .then(() => {
    console.log("✅ Redis Connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server Listening at PORT: ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("❌ Server Error:", error.message);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start application:", error.message);
    process.exit(1);
  });