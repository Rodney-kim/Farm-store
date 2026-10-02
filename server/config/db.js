import mongoose from "mongoose";

/**
 * Connects to MongoDB using the connection string in the MONGODB_URI
 * environment variable. The app exits if the connection fails, since
 * there is nothing useful the API can do without a database.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Missing MONGODB_URI in your .env file.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
