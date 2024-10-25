// /lib/mongoose.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  return mongoose.connect(mongoURI);
}

export default connectToDatabase;
