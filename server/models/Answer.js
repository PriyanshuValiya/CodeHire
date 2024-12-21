import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    require: true,
  },
  questionId: {
    type: String,
    require: true,
  },
  question: {
    type: String,
    require: true,
  },
  correctAnswer: {
    type: String,
    require: true,
  },
  userAnswer: {
    type: String,
    require: true,
  },
  feedback: {
    type: String,
    require: true,
  },
  topic: {
    type: String,
    require: false,
  },
  rating: {
    type: Number,
    require: true,
  },
});

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;
