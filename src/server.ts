import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { envVers } from "./config/env";
import { superAdmin } from "./utils/super.admin";

let server: Server;

async function startServer() {
  try {
    await mongoose.connect(envVers.DB_URL);
    server = app.listen(envVers.PORT, () => {
      console.log(`server is running on port ${envVers.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

(async () => {
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
