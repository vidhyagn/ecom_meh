import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = async() => {
  try {
   const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Failed",error.message);
  }
};

export  {dbConnect};