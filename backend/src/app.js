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
// Try several locations to be robust to different working directories (Render, local, etc.)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleFrontendDirs = [
  path.join(process.cwd(), 'frontend', 'dist'),            // when server runs from repo root
  path.join(__dirname, '..', '..', 'frontend', 'dist'),   // when server runs from backend/ (common on Render)
  path.join(__dirname, '..', 'frontend', 'dist'),        // alternative layout
];

const frontendDist = possibleFrontendDirs.find(dir => fs.existsSync(dir));
if (frontendDist) {
  console.log('Serving frontend from:', frontendDist);
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  console.warn('Frontend "dist" folder not found. Looked in:\n' + possibleFrontendDirs.join('\n'));
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