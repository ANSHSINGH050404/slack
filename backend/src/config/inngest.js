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
            const { id, email_addresses, first_name, last_name, image_url } = event.data;
            
            const newUser = {
                clerkId: id,
                email: email_addresses[0]?.email_address,
                name: `${first_name || ""} ${last_name || ""}`.trim(),
                image: image_url,
            };
            
            await User.create(newUser);
            console.log(`User synced successfully: ${newUser.email}`);
        } catch (error) {
            console.error("Error syncing user:", error);
            throw error;
        }
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            await connectDb();
            const { id } = event.data;
            
            await User.deleteOne({ clerkId: id });
            
            // Note: deleteSteamUser function is not imported
            // You'll need to import it or implement the logic here
            // await deleteSteamUser(id.toString());
            
            console.log(`User deleted successfully: ${id}`);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
);

// Export the functions array
export const functions = [syncUser, deleteUserFromDB];