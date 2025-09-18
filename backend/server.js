const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./.env" });

// Debug environment variables
console.log("Environment check:");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Set" : "❌ Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Not set");
console.log("PORT:", process.env.PORT || "Using default 5000");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Frontend URLs
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!", status: "OK" });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Test route working!",
    timestamp: new Date().toISOString(),
  });
});

// Routes
console.log("Registering auth routes...");
app.use("/api/auth", require("./routes/auth"));
console.log("Registering notes routes...");
app.use("/api/notes", require("./routes/notes"));
console.log("All routes registered successfully");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/note-management"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
