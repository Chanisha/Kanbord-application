const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Test routes
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!", status: "OK" });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Test route working!",
    timestamp: new Date().toISOString(),
  });
});

// Test auth route
app.post("/api/auth/test", (req, res) => {
  res.json({ message: "Auth route working!", body: req.body });
});

// Test notes route
app.post("/api/notes/test", (req, res) => {
  res.json({ message: "Notes route working!", body: req.body });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
  console.log("Test these endpoints:");
  console.log("- GET http://localhost:5000/api/health");
  console.log("- GET http://localhost:5000/api/test");
  console.log("- POST http://localhost:5000/api/auth/test");
  console.log("- POST http://localhost:5000/api/notes/test");
});
