import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs";
import userRoutes from "./routes/users.routes.js"
import interviewRoutes from "./routes/interview.routes.js"
import { connnectToSocket } from "./controllers/socketManager.js"

dotenv.config();

const app = express();
const server = createServer(app);
const io = connnectToSocket(server)

const PORT = process.env.PORT || 3000;
const DBURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/Meetlance";

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// app.get("/", (req, res) => {
//     res.json({ "Hello": "Coding World!" });
// });

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/interview", interviewRoutes);

// Serve frontend static build (if present) and provide SPA fallback so client-side routes work on refresh
const frontendDist = path.join(process.cwd(), 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const start = async () => {
  try {
    await mongoose.connect(DBURL);
    console.log("MongoDB connected successfully!");
    server.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

start();