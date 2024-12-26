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
const allowedOrigins = [
  "http://localhost:3000",
  "https://code-hire.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
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
