// server.js
const express = require("express");
const mongoose = require("mongoose");

// Initialize Express app
const app = express();

// MongoDB connection string
const mongoURI =
  "mongodb+srv://User:h0YxJuCevVY8ozcX@cluster0.2asso.mongodb.net/GadInfoDB?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Middleware to parse JSON
app.use(express.json());

// Define a Mongoose schema and model for users
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// API endpoint for sign-up
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error); // Detailed error logging
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Simple route for testing the server
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
