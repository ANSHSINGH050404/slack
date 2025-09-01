import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import { connectDb } from "./db/db.js";
import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

const app = express();

// Verify Clerk keys are loaded
console.log("Environment check:", {
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "✅ Set" : "❌ Missing",
  MONGO_URL: process.env.MONGO_URL ? "✅ Set" : "❌ Missing"
});

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Hello World! 123");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

const startServer = async () => {
  try {
    await connectDb();
    const PORT = process.env.PORT || 3001;
    
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log("Server started on port:", PORT);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
export default app;