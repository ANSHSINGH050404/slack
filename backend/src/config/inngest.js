import { Inngest } from "inngest";
import { connectDb } from "../db/db.js";
import { User } from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDb();
      
      // Fixed typo: firt_name → first_name
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      
      const newUser = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url,
      };
      
      await User.create(newUser);
      console.log("User synced successfully:", id);
      
    } catch (error) {
      console.error("Error syncing user:", error);
      throw error; // Re-throw so Inngest can handle retries
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      // Fixed typo: connectDB → connectDb
      await connectDb();
      
      const { id } = event.data;
      const result = await User.deleteOne({ clerkId: id });
      
      if (result.deletedCount > 0) {
        console.log("User deleted successfully:", id);
      } else {
        console.log("User not found for deletion:", id);
      }
      
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error; // Re-throw so Inngest can handle retries
    }
  }
);

// Export functions
export const functions = [syncUser, deleteUserFromDB];