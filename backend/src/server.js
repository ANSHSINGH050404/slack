import express from "express";

import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
// import cors from "cors";
import { connectDb } from "./db/db.js";
import dotenv from "dotenv";
const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use(clerkMiddleware());
// app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello World! 123");
});

// Inngest endpoint for handling background jobs
app.use("/api/inngest", serve({ client: inngest, functions }));

const startServer = async () => {
  try {
    await connectDb();
    if (process.env.NODE_ENV !== "production") {
      app.listen(process.env.PORT, () => {
        console.log("Server started on port:", process.env.PORT);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

startServer();

// Export the Express app as the default export for Vercel
export default app;
