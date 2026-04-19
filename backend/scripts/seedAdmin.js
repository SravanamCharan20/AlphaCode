import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME?.trim() || "Admin";
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an admin account.",
    );
  }

  await connectDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.username = username;
    existingUser.password = password;
    existingUser.role = "admin";
    await existingUser.save();

    console.log(`Admin user updated for ${email}`);
  } else {
    await User.create({
      username,
      email,
      password,
      role: "admin",
    });

    console.log(`Admin user created for ${email}`);
  }

  await mongoose.connection.close();
}

seedAdmin().catch(async (error) => {
  console.error("Admin seed failed:", error.message);
  await mongoose.connection.close();
  process.exit(1);
});
