import express from "express";
import { connectDb } from "../db/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "../config/inngest.js";
import { serve } from "inngest/express";

const app = express();

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// Database connection middleware for serverless
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// Inngest endpoint for handling background jobs
app.use("/api/inngest", serve({ client: inngest, functions }));

// Basic health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Slack Clone API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    platform: "vercel-serverless"
  });
});

// Add your API routes here
// app.use("/api/users", userRoutes);
// app.use("/api/channels", channelRoutes);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { details: err.message })
  });
});

// Export the Express app as the default export for Vercel
export default app;