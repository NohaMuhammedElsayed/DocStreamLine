// server/inngest/index.js
import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodeMaile.js";

// ✅  Client
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
    console.log("User saved to DB:", userData);

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
    console.log("User Updated Event:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: image_url,
    };

    await User.findByIdAndUpdate(id, updatedUserData);
    console.log("User updated in DB:", updatedUserData);

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
    console.log(" User Deleted Event:", event.data);

    const { id } = event.data;
    await User.findByIdAndDelete(id);

    console.log("User deleted from DB:", id);
    return { status: "ok", deletedId: id };
  }
)

//Inngest Function to send reminder when a new connection request is added
const sendConnectionRequestReminder = inngest.createFunction(
  { id: "send-connection-request-reminder" },
  { event: "app/connection.request" },
    async ({ event, step }) => {
    const {connectionId} = event.data;
  
    await step.run("send-connection-request-mail", async () => {
      // Logic to send email reminder about the connection request
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
      const subject = `New Connection Request!`;
      const body = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2> Hi ${connection.to_user_id.full_name}, </h2>
      <p> You have a new connection request from Dr. ${connection.from_user_id.full_name} - @${connection.from_user_id.username} </p>
      <p> Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request. </p>
      <br/>
      <p>Thanks, <br/> SocialMediaApp Team</p>
      </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body
      })

    })
      const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
      await step.sleepUntil("wait-24-hours", in24Hours);
      await step.run("send-connection-request-reminder", async () => {
        const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
        if(connection.status === "accepted"){
           return {message: "Already accepted"}
        }

      const subject = `New Connection Request!`;
      const body = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2> Hi ${connection.to_user_id.full_name}, </h2>
      <p> You have a new connection request from Dr. ${connection.from_user_id.full_name} - @${connection.from_user_id.username} </p>
      <p> Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject the request. </p>
      <br/>
      <p>Thanks, <br/> SocialMediaApp Team</p>
      </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body
      })

      return {status: "reminder sent"};

    })

  }

)

// Export كل الفانكشنز
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion, sendConnectionRequestReminder];
