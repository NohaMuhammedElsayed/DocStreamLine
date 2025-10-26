import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- Core Identifiers ---
    _id: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String },
    password: { type: String, required: false },

    // --- Profile Details ---
    full_name: { type: String },
    bio: { type: String, default: "Hey Doctors!" },
    profile_picture: { type: String, default: "" },
    cover_photo: { type: String, default: "" },
    specialty: { type: String, default: "" },
    // --- Social & Connections ---
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }],
    connections: [{ type: String, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;
