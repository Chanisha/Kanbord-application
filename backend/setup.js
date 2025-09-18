const fs = require("fs");
const path = require("path");

// Create .env file from config.env if it doesn't exist
const envPath = path.join(__dirname, ".env");
const configPath = path.join(__dirname, "config.env");

if (!fs.existsSync(envPath) && fs.existsSync(configPath)) {
  fs.copyFileSync(configPath, envPath);
  console.log("✅ Created .env file from config.env");
} else if (fs.existsSync(envPath)) {
  console.log("✅ .env file already exists");
} else {
  console.log("⚠️  Please create a .env file with your configuration");
}

console.log("\n🚀 Backend setup complete!");
console.log("\nNext steps:");
console.log("1. Install dependencies: npm install");
console.log("2. Make sure MongoDB is running");
console.log("3. Start the server: npm run dev");
console.log("\n📝 Don't forget to update your .env file with:");
console.log("- MONGODB_URI: Your MongoDB connection string");
console.log("- JWT_SECRET: A secure secret for JWT signing");
