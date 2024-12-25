import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import resumeRoutes from "./routes/ResumeRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";
import interviewRoutes from "./routes/InterviewRoutes.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors());
app.use(cors({ origin: 'https://code-hire-server.vercel.app' }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/interview", interviewRoutes);

app.get("/", (req, res) => {
  res.send("CodeHire Root API");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
