import mongoose from "mongoose";
import { config } from "./app-config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Database connected Successfully");
  } catch (error: any) {
    console.log("❌ Error connecting Mongo Db");
    process.exit(1);
  }
};

export default connectDatabase;
