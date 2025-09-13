import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- Core Identifiers ---
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // --- Profile Details ---
    full_name: { type: String, required: true },
    bio: { type: String, default: "Hey Doctors!" },
    profile_picture: { type: String, default: "" },
    cover_photo: { type: String, default: "" },
    location: { type: String, default: "" },

    // --- Professional Info ---
    graduatedFrom: { type: String, required: true },
    specialty: { type: String, required: true },
    medicalDegree: { type: String, required: true },

    // Added for Egyptian doctor verification
    medicalSyndicateID: { type: String, required: true, unique: true }, // رقم القيد بالنقابة
    syndicateCardImage: { type: String, required: true },               // رابط لصورة الكارنيه

    // --- Social & Connections ---
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }],
    connections: [{ type: String, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", userSchema);
export default User;
