import { Inngest } from "inngest";
//import { createUserInMongo } from "../userHelpers.js"; 
import User from "../models/User.js";

export const inngest = new Inngest({ id: "socialmediaApp-app" });

// Inngest Function to save user to a database
 const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const {id, first_name, last_name, email_addresses, profile_image_url, image_url} = event.data
    let username = email_addresses[0].email_address.split('@')[0]

    //Check availability of username
    const user = await User.findOne({username})

    if (user) {
      username = username + Math.floor(Math.random() * 10000)
    }

    const userData = {
      _id: id,
      username: username || undefined, // مش دايمًا بيرجع
      email: email_addresses[0]?.email_address,
      full_name: `${first_name ||""} ${last_name ||""}`.trim(),
      profile_picture: profile_image_url || image_url || "",
    };
    await User.create(userData)
     return { status: "ok", user: userData };
  }
);

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: `${first_name ||""} ${last_name ||""}`.trim(),
      profile_picture: image_url,
    };
    await User.findByIdAndUpdate(id, updatedUserData)
     return { status: "ok", user: updatedUserData };
  }
);

// Inngest Function to delete user data in database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const {id} = event.data
    await User.findByIdAndDelete(id)
     return { status: "ok", deletedId: id };
  }
);

export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
