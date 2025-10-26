import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "socialmediaapp",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
