import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- Core Identifiers ---
    _id: { type: String },
    username: { type: String, unique: true },
    email: { type: String },
    password: { type: String, required: false },

    // --- Profile Details ---
    full_name: { type: String },
    bio: { type: String, default: "Hey Doctors!" },
    profile_picture: { type: String, default: "" },
    cover_photo: { type: String, default: "" },
    location: { type: String, default: "" },
    // --- Social & Connections ---
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }],
    connections: [{ type: String, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("Useer", userSchema);
export default User;
