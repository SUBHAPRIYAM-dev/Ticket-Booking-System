const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

// ✅ Admin Authentication Middleware (Using Admin Model)
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ message: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Check if the admin exists in the database
    const admin = await Admin.findOne({ email: decoded.adminEmail });
    if (!admin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    req.admin = admin; // Attach admin details to request
    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Set up Multer for file uploads (student ID card)
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Ensure that 'uploads/' folder exists in the root directory
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      cb(null, `${timestamp}-${file.originalname}`);  // Rename the file to avoid overwriting
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
});

// ✅ Register a Student (Handle form data and file upload)
router.post("/register", upload.single('studentIdCard'), async (req, res) => {
  try {
    console.log("🔹 Registering new student...");

    const { name, rollNo, branch, email, phone } = req.body;

    // Check if required fields and the uploaded file are present
    if (!name || !rollNo || !branch || !email || !phone || !req.file) {
      return res.status(400).json({ message: "Missing required fields or file." });
    }

    // Save student details, including the uploaded file (studentIdCard)
    const newStudent = new Student({
      name,
      rollNo,
      branch,
      email,
      phone,
      studentIdCard: req.file.path, // Store the file path in the database
    });

    await newStudent.save();

    console.log("✅ Student registered successfully!");
    res.status(201).json({
      message: "Student registered successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("❌ Error registering student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Fetch All Students for Admin (No changes needed here)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    console.log("🔹 Fetching all students for admin...");

    // Fetch students from the database
    const students = await Student.find().sort({ createdAt: -1 });

    if (!students || students.length === 0) {
      console.warn("⚠️ No students found in the database.");
      return res.status(404).json({ message: "No students found." });
    }

    console.log(`✅ Found ${students.length} students.`);
    res.json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
