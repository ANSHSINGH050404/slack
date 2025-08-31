import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

// Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// Inngest endpoint for handling background jobs
app.use("/api/inngest", serve({ client: inngest, functions }));

// Basic health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Slack Clone API is running!", 
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

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

const startServer = async () => {
  try {
    // Connect to database
    await connectDb();
    console.log("✅ Database connected successfully");

    // Start server (both development and production)
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`📡 Inngest endpoint: http://localhost:${PORT}/api/inngest`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });

  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();

export default app;