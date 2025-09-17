// server/inngest/index.js
import { Inngest } from "inngest";
import User from "../models/User.js";

// ✅ إنشاء Client
export const inngest = new Inngest({ id: "socialmediaApp-app" });

/**
 * Function: Create or upsert user
 */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("🔥 User Created Event:", event.data);

    const {
      id,
      first_name,
      last_name,
      email_addresses,
      profile_image_url,
      image_url,
    } = event.data;

    // ✅ إنشاء username من الإيميل
    let username = email_addresses?.[0]?.email_address?.split("@")[0] || "user";
    const existing = await User.findOne({ username });
    if (existing) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      username,
      email: email_addresses?.[0]?.email_address || "",
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: profile_image_url || image_url || "",
    };

    // ✅ استعمل upsert: لو موجود يعمل update، لو مش موجود يعمل insert
    const savedUser = await User.findByIdAndUpdate(id, userData, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    console.log("✅ User saved/updated in DB:", savedUser);

    return { status: "ok", user: savedUser };
  }
);

export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log("♻️ User Ued Event:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const updatedUserData = {
      email: email_addresses?.[0]?.email_address || "",
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: image_url || "",
    };

    const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    });

    console.log("✅ User updated in DB:", updatedUser);

    return { status: "ok", user: updatedUser };
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
