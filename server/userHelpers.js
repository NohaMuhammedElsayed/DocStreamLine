// server/userHelpers.js
import mongoose from "mongoose";
import User from "./models/User.js";

async function connectDBIfNeeded() {
  if (mongoose.connection.readyState === 0) { // 0 = disconnected
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected (from helper)");
  }
}

export async function createUserInMongo(data) {
  await connectDBIfNeeded();

  const { id, first_name, last_name, email_addresses, image_url } = data;
  if (!id || !email_addresses?.[0]?.email_address) return null;

  let username = email_addresses[0].email_address.split("@")[0];
  const existingUser = await User.findOne({ username });
  if (existingUser) username += Math.floor(Math.random() * 10000);

  const userData = {
    _id: id,
    email: email_addresses[0].email_address.toLowerCase(),
    full_name: first_name + " " + last_name,
    profile_picture: image_url || "",
    username,
  };

  const user = await User.create(userData);
  console.log("✅ User created in MongDB:", user);
  return user;
}
