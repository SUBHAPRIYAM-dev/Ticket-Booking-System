const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Ensure .env variables are loaded

// Use environment variables for the admin email and password
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ✅ Define Admin Schema
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// ✅ Hash password only before initial creation (NOT on every save)
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified
  try {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
    next();
  } catch (error) {
    next(error); // Pass error to next()
  }
});

// ✅ Method to compare passwords securely
AdminSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Static method to initialize a single admin account
AdminSchema.statics.initializeAdmin = async function () {
  try {
    const existingAdmin = await this.findOne({ email: ADMIN_EMAIL });

    if (!existingAdmin) {
      console.log("🔹 No admin found. Creating default admin...");
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      await this.create({ email: ADMIN_EMAIL, password: hashedPassword });

      console.log("✅ Default admin created successfully.");
    } else {
      console.log("🔹 Admin already exists. No changes made.");
    }
  } catch (error) {
    console.error("❌ Error initializing admin:", error);
  }
};

module.exports = mongoose.model("Admin", AdminSchema);
