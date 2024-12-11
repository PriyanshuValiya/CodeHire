import express from "express";
import { createProfile, getProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/createuser", createProfile);
router.post("/getuser", getProfile);

export default router;
