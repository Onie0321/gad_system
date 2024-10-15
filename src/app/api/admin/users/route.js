import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../../../../../models/User";
import ActivityLog from "../../../../../models/ActivityLog";

const mongoURI = process.env.MONGODB_URI;
const ADMIN_CODE = process.env.ADMIN_CODE;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  return mongoose.connect(mongoURI);
}

// Middleware to check if the user is an admin
async function isAdmin(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) return false;

  // Implement your token verification logic here
  // For example, using jwt.verify(token, process.env.JWT_SECRET)
  // Return true if the user is an admin, false otherwise
}

// List users with pagination and filtering
export async function GET(req) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error.message },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(req) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
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

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Log activity
    await ActivityLog.create({
      user: req.headers.get("user-id"), // Assuming you set this in your auth middleware
      action: "create_user",
      details: `Created user: ${email}`,
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error.message },
      { status: 500 }
    );
  }
}

// Update a user
export async function PUT(req) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id, name, email, role, status } = await req.json();

    if (!id || (!name && !email && !role && !status)) {
      return NextResponse.json(
        { message: "Invalid update data" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Log activity
    await ActivityLog.create({
      user: req.headers.get("user-id"),
      action: "update_user",
      details: `Updated user: ${updatedUser.email}`,
    });

    return NextResponse.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error.message },
      { status: 500 }
    );
  }
}

// Delete a user
export async function DELETE(req) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Log activity
    await ActivityLog.create({
      user: req.headers.get("user-id"),
      action: "delete_user",
      details: `Deleted user: ${deletedUser.email}`,
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error.message },
      { status: 500 }
    );
  }
}
