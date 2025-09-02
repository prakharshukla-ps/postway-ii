import mongoose from "mongoose";

const url = process.env.DB_URL;

export const connectToDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Mongodb connected using mongoose");
  } catch (err) {
    console.log(err);
  }
};
