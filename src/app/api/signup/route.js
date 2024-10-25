import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../../../../models/User";

const mongoURI = process.env.MONGODB_URI;
const ADMIN_CODE = process.env.ADMIN_CODE;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  return mongoose.connect(mongoURI);
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, email, password, adminCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user role
    let role = "user";
    if (email.endsWith("@ascot.edu.ph")) {
      role = "officer";
    }
    if (adminCode === ADMIN_CODE) {
      role = "admin";
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "admin" && { adminCode }),
    });

    await newUser.save();

    // Determine redirect URL based on role
    let redirectUrl = "/officer";
    if (role === "admin") {
      redirectUrl = "/admin";
    } else if (role === "officer") {
      redirectUrl = "/officer";
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        redirectUrl,
        role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred. Please try again.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
