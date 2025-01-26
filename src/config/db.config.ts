import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
      socketTimeoutMS: 45000, // Increase socket timeout
      connectTimeoutMS: 20000, // Connection timeout
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Add connection error handler
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
}); 