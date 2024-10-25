// /lib/mongodb.js

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// Check if MongoDB URI is provided
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Check if MongoDB DB name is provided
if (!MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable");
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Use cached connection if it exists
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create a new MongoDB client and connect
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DB);

  // Cache the client and database objects for reuse
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
