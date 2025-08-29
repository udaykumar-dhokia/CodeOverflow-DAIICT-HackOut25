import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL: string = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL).then(() => {
      console.log("🏭MongoDB connected.");
    });
  } catch (error) {
    console.log("Error connecting with MongoDB.");
  }
};

export default connectDB;