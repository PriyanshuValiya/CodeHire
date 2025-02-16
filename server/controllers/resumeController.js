import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const checkATS = async (req, res) => {
  const { jobPosition, jobDesc } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const PROMPT = `Job Position: ${jobPosition} and Job Description: ${jobDesc}. ${process.env.RESUME_PROMPT}`;

  try {
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "resume_uploads",
      resource_type: "image",
    });

    if (!uploadResponse.secure_url) {
      throw new Error("Failed to upload resume to Cloudinary");
    }

    const resumeImageURL = uploadResponse.secure_url;

    // const imagePart = fileToGenerativePart(resumeImageURL, "image/jpeg");
    const imagePart = fileToGenerativePart(req.file.path, "image/jpeg");
    const result = await model.generateContent([PROMPT, imagePart]);

    const finalResult = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    const parsedResponse = JSON.parse(finalResult);
    return res.status(200).json({ parsedResponse });
  } catch (error) {
    console.error("Error in ATS Check:", error);
    return res
      .status(400)
      .json({ message: "Error in Gemini response generation" });
  }
};

const generateSkill = async (req, res) => {
  const { description } = req.body;

  const PROMPT = `Job Description: ${description}. Suggest the top keyword tech-skills (only technology name) for this job-role for resume.`;

  try {
    const result = await model.generateContent(PROMPT);
    const response = result.response.text();
    return res.status(200).json({ response });
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ message: "Error while Generating Acheivement" });
  }
};

const generateExperience = async (req, res) => {
  const { experience } = req.body;

  const PROMPT = `Experience: {Position Title=${experience.title}, Company Name=${experience.companyName}, Work Summary = ${experience.workSummary}}. Make Work Summary professional paragraph text in 25-30 words for resume.`;

  try {
    const result = await model.generateContent(PROMPT);
    const response = result.response.text();
    return res.status(200).json({ response });
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ message: "Error while Generating Experience" });
  }
};

const generateProject = async (req, res) => {
  const { project } = req.body;

  const PROMPT = `Project: {Title=${project.title}, Used Tech-Stack=${project.techstack}, Description=${project.description}}. Make a professional Project Summary in 15-20 words using given details for resume.`;

  try {
    const result = await model.generateContent(PROMPT);
    const response = result.response.text();
    return res.status(200).json({ response });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: "Error while Generating Project" });
  }
};

const generateAchievements = async (req, res) => {
  const { achievement } = req.body;

  const PROMPT = `Acheivement: {Title: ${achievement.title}, Description: ${achievement.description}}. Make a professional Acheivement Summary in 15-20 words using given details for resume.`;

  try {
    const result = await model.generateContent(PROMPT);
    const response = result.response.text();
    return res.status(200).json({ response });
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ message: "Error while Generating Acheivement" });
  }
};

export {
  checkATS,
  generateSkill,
  generateExperience,
  generateProject,
  generateAchievements,
};
