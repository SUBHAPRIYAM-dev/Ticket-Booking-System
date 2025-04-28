require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs"); // ✅ For checking if uploads folder exists
const connectDB = require("./config/db");

const app = express();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret"; // Ensure a secret key is set

// ✅ Connect to the database
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Exit if DB connection fails
  });

// ✅ Middleware
app.use(express.json()); // Parse incoming JSON
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // ✅ Log HTTP requests for debugging

// ✅ Serve static files (Ensure uploads folder is accessible)
const uploadsPath = path.resolve(__dirname, "uploads");
if (fs.existsSync(uploadsPath)) {
  app.use("/uploads", express.static(uploadsPath));
  console.log(`📸 Serving static files from: ${uploadsPath}`);
} else {
  console.warn("⚠️ Warning: 'uploads' folder is missing. Images may not load.");
}

// ✅ Debug: Log environment variables (EXCLUDE passwords)
console.log("📌 Loaded Environment Variables:");
console.log(" - PORT:", process.env.PORT || 5000);
console.log(" - DATABASE_URI:", process.env.DATABASE_URI ? "✅ Set" : "❌ Not Set");

// ✅ Routes
app.use("/api/admin", require("./routes/admin"));
app.use("/api/students", require("./routes/student")); // ✅ Fixed incorrect path

// ✅ Catch-all for invalid routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message || err,
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
