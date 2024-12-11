import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connection Successfull !!");
  } catch (err) {
    console.error(`Error : ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
