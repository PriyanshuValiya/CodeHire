import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import dotenv from "dotenv";
dotenv.config();

const getAptitude = async (req, res) => {
  const { id } = req.query;

  try {
    const data = await Question.findById(id);

    if (data) {
      return res.status(200).json({ data });
    } else {
      return res.status(404).json({ message: "Data Not Found in Database" });
    }
  } catch (err) {
    console.log("Error fetching data: ", err);
    return res.status(500).json({ message: "Aptitude Data Not Found !!" });
  }
};

const aptitude = async (req, res) => {
  const {
    company,
    position,
    selectedExperience,
    selectedRound,
    jsonResponse,
    user,
  } = req.body;

  const newAptitude = new Question({
    company,
    position,
    selectedExperience,
    selectedRound,
    jsonResponse,
    createdBy: user || "demo@gmail.com",
    createdAt: new Date(),
  });

  try {
    const savedAptitude = await newAptitude.save();
    return res.status(200).json({ id: savedAptitude._id });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "Error while Generating Aptitude Question" });
  }
};

const getFeedback = async (req, res) => {
  const { id } = req.query;

  try {
    const data = await Answer.find({ questionId: id });

    if (data) {
      return res.status(200).json({ data });
    } else {
      return res
        .status(400)
        .json({ message: "Aptitude Answer Data Not Found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Aptitude Answer Data Not Found" });
  }
};

const saveAptitude = async (req, res) => {
  const {
    questionId,
    question,
    correctAnswer,
    userAnswer,
    feedback,
    topic,
    rating,
    userEmail,
  } = req.body;

  const newAptitudeAnswer = new Answer({
    questionId,
    question,
    correctAnswer,
    userAnswer,
    feedback,
    topic,
    rating,
    createdBy: userEmail,
  });

  try {
    await newAptitudeAnswer.save();
    return res.status(200).json({ message: "Saved Aptitude Answer" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error at Save Aptitude Answer" });
  }
};

const getHistory = async (req, res) => {
  const { mail } = req.query;

  try {
    const data = await Question.find({ createdBy: mail });

    if (data) {
      return res.status(200).json({ data });
    } else {
      return res.status(404).json({ message: "Data Not Found in Database" });
    }
  } catch (err) {
    console.log("Error fetching data: ", err);
    return res.status(500).json({ message: "Interviews Not Found !!" });
  }
};

const getBehavioral = async (req, res) => {
  const { id } = req.query;

  try {
    const data = await Question.findById(id);

    if (data) {
      return res.status(200).json({ data });
    } else {
      return res.status(404).json({ message: "Data Not Found in Database" });
    }
  } catch (err) {
    console.log("Error fetching data: ", err);
    return res.status(500).json({ message: "Aptitude Data Not Found !!" });
  }
};

const behavioral = async (req, res) => {
  const {
    company,
    position,
    selectedExperience,
    selectedRound,
    jsonResponse,
    user,
  } = req.body;

  const newBehavioral = new Question({
    company,
    position,
    selectedExperience,
    selectedRound,
    jsonResponse,
    createdBy: user || "demo@gmail.com",
    createdAt: new Date(),
  });

  try {
    const savedBehavioral = await newBehavioral.save();
    return res.status(200).json({ id: savedBehavioral._id });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "Error while Generating Behavioral Question" });
  }
};

const saveBehavioral = async (req, res) => {
  const {
    questionId,
    question,
    correctAnswer,
    userAnswer,
    feedback,
    rating,
    userEmail,
  } = req.body;

  const newAptitudeAnswer = new Answer({
    questionId,
    question,
    correctAnswer,
    userAnswer,
    feedback,
    rating,
    createdBy: userEmail,
  });

  try {
    await newAptitudeAnswer.save();
    return res.status(200).json({ message: "Saved Behavioral Answer" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error at Save Behavioral Answer" });
  }
};

const technical = async (req, res) => {
  const {
    company,
    position,
    selectedExperience,
    selectedRound,
    jsonResponse,
    user,
  } = req.body;

  const newAptitude = new Question({
    company,
    position,
    selectedExperience,
    selectedRound,
    jsonResponse,
    createdBy: user || "demo@gmail.com",
    createdAt: new Date(),
  });

  try {
    const savedAptitude = await newAptitude.save();
    return res.status(200).json({ id: savedAptitude._id });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "Error while Generating Aptitude Question" });
  }
};

const getTechnical = async (req, res) => {
  const { id } = req.query;

  try {
    const data = await Question.findById(id);

    if (data) {
      return res.status(200).json({ data });
    } else {
      return res.status(404).json({ message: "Data Not Found in Database" });
    }
  } catch (err) {
    console.log("Error fetching data: ", err);
    return res.status(500).json({ message: "Technical Data Not Found !!" });
  }
};

const saveTechnical = async (req, res) => {
  const {
    questionId,
    question,
    correctAnswer,
    userAnswer,
    feedback,
    rating,
    userEmail,
  } = req.body;

  const newTechnicalAnswer = new Answer({
    questionId,
    question,
    correctAnswer,
    userAnswer,
    feedback,
    rating,
    createdBy: userEmail,
  });

  try {
    await newTechnicalAnswer.save();
    return res.status(200).json({ message: "Saved Technical Answer" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error at Save Technical Answer" });
  }
};

export {
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
  saveTechnical,
};
