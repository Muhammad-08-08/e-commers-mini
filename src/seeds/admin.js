import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import connectDB from "../config/db.js";

connectDB();

const createAdmin = async () => {
  try {
    const exists = await User.findOne({ role: "admin" });
    if (exists) {
      console.log("Admin allaqachon mavjud");
      process.exit(0);
    }

    const hashed = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashed,
      role: "admin",
    });

    console.log("First admin yaratildi:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
