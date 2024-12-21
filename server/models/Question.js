import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    require: true,
  },
  selectedRound: {
    type: String,
    require: true,
  },
  company: {
    type: String,
    require: true,
  },
  position: {
    type: String,
    require: true,
  },
  selectedExperience: {
    type: String,
    require: true,
  },
  jsonResponse: {
    type: Array,
    require: true,
  },
  createdAt: {
    type: Date,
  },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
