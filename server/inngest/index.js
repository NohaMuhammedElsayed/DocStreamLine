// server/inngest/index.js
import { Inngest } from "inngest";
import User from "../models/User.js";

// ✅ إنشاء Client
export const inngest = new Inngest({ id: "socialmediaApp-app" });

/**
 * Function: Create user
 */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("🔥 User Creatd Event:", event.data);

    const {
      id,
      first_name,
      last_name,
      email_addresses,
      profile_image_url,
      image_url,
    } = event.data;

    let username = email_addresses[0].email_address.split("@")[0];
    const existing = await User.findOne({ username });
    if (existing) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      username: username || undefined, // مش دايمًا بيرجع
      email: email_addresses[0]?.email_address,
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: profile_image_url || image_url || "",
    };
    console.log(" User notsaved to DB :(");
    await User.create(userData);
    console.log("✅ User saved to DB:", userData);

    return { status: "ok", user: userData };
  }
);

/**
 * Function: Update user
 */
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log("♻️ User Updated Event:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: image_url,
    };

    await User.findByIdAndUpdate(id, updatedUserData);
    console.log("✅ User updated in DB:", updatedUserData);

    return { status: "ok", user: updatedUserData };
  }
);

/**
 * Function: Delete user
 */
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("🗑️ User Deleted Event:", event.data);

    const { id } = event.data;
    await User.findByIdAndDelete(id);

    console.log("✅ User deleted from DB:", id);
    return { status: "ok", deletedId: id };
  }
);

// ✅ Export كل الفانكشنز
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
