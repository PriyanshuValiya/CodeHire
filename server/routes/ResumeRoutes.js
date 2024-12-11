import express from "express";
import multer from "multer";
import path from "path";
import {
  checkATS,
  generateSkill,
  generateExperience,
  generateProject,
  generateAchievements,
} from "../controllers/resumeController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public"));
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now();
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/checkats", upload.single("file"), checkATS);
router.post("/skill", generateSkill);
router.post("/experience", generateExperience);
router.post("/project", generateProject);
router.post("/acheivement", generateAchievements);

export default router;
