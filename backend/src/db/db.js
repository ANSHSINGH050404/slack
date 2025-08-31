import mongoose from "mongoose";

export function connectDb() {
  try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(console.log("Mongodb Connected"));
  } catch (error) {
    console.log("Mongo db error", error);
    process.exit(1);
  }
}
