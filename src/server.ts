import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { envVars } from "./config/env";
import { superAdmin } from "./utils/super.admin";
import { connectRedis } from "./config/redisClient";

let server: Server;

async function startServer() {
  try {
    await mongoose.connect(envVars.DB_URL);
    server = app.listen(envVars.PORT, () => {
      console.log(`server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  await connectRedis();
  await startServer();
  await superAdmin();
})();

process.on("SIGINT", () => {
  console.log("server shut down");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
