import express from "express";
import {
  getAptitude,
  aptitude,
  getFeedback,
  saveAptitude,
  getHistory,
  getBehavioral,
  behavioral,
  saveBehavioral,
  getTechnical,
  technical,
  saveTechnical
} from "../controllers/interviewController.js";

const router = express.Router();

router.get("/aptitude", getAptitude);
router.post("/aptitude", aptitude);
router.get("/saveaptitude", getFeedback);
router.post("/saveaptitude", saveAptitude);

router.get("/behavioral", getBehavioral);
router.post("/behavioral", behavioral);
router.post("/savebehavioral", saveBehavioral);

router.get("/technical", getTechnical);
router.post("/technical", technical);
router.post("/savetechnical", saveTechnical);

router.get("/gethistory", getHistory);

export default router;
