import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI); // Print the URI to check
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
