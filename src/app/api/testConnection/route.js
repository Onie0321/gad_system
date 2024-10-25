import mongoose from "mongoose";

// MongoDB connection string
const mongoURI =
  "mongodb+srv://User:h0YxJuCevVY8ozcX@cluster0.2asso.mongodb.net/GadInfoDB?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB (this will prevent multiple connections in development)
if (!mongoose.connection.readyState) {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));
}

// Define a Mongoose schema and model for users (if not already defined)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export async function GET(req, res) {
  try {
    // Find a user in the database
    const test = await User.find({}).limit(1).exec();

    return new Response(
      JSON.stringify({
        message: "Connected to MongoDB!",
        testData: test,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Failed to connect to MongoDB",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
