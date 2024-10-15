import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../../../../models/User";

const mongoURI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  return mongoose.connect(mongoURI);
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Determine redirect URL based on user role
    let redirectUrl = "/officer";
    switch (user.role) {
      case "admin":
        redirectUrl = "/admin";
        break;
      case "officer":
        redirectUrl = "/officer";
        break;
      default:
        redirectUrl = "/user";
    }

    return NextResponse.json(
      {
        message: "Sign-in successful",
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
