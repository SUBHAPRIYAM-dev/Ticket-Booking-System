const express = require("express");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const generateQR = require("../utils/generateQR");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

// ✅ Initialize Admin Account
const initializeAdmin = async () => {
  try {
    console.log("🔹 Checking for existing admin...");
    await Admin.initializeAdmin();
    console.log("✅ Admin account initialized.");
  } catch (error) {
    console.error("❌ Error initializing admin:", error);
  }
};

// ✅ Run initialization on the first request
router.use(async (req, res, next) => {
  await initializeAdmin();
  next();
});

// ✅ Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ adminEmail: email }, SECRET_KEY, { expiresIn: "2h" });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Authentication Middleware (Improved Token Handling)
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(403).json({ message: "Access denied, no token provided" });

    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.adminEmail !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

// ✅ Fetch All Students for Admin
router.get("/students", authMiddleware, async (req, res) => {
  try {
    console.log("🔹 Fetching all students for admin...");

    const students = await Student.find().sort({ createdAt: -1 });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found." });
    }

    // ✅ Ensure studentIdCard contains full URL
    const baseURL = "http://localhost:5000";
    const studentsWithImageURLs = students.map((student) => ({
      ...student._doc,
      studentIdCard: student.studentIdCard 
        ? `${baseURL}/${student.studentIdCard.replace(/\\/g, "/")}` 
        : null,
    }));

    console.log("✅ Student data with fixed image URLs:", studentsWithImageURLs);
    res.json(studentsWithImageURLs);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Approve a Student
router.put("/approve/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.approved) {
      return res.status(400).json({ message: "Student is already approved" });
    }

    student.qrCode = await generateQR(student.rollNo);
    student.approved = true;
    student.rejected = false;
    await student.save();

    await sendEmail(student.email, student.name, "Dream Fest 2K25", student.rollNo, true);
    console.log(`✅ Approved student ${student.name} (${student.rollNo})`);

    res.json({ message: "Student approved successfully", student });
  } catch (error) {
    console.error("❌ Error approving student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Reject a Student
router.put("/reject/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.approved = false;
    student.rejected = true;
    student.qrCode = null;
    await student.save();

    await sendEmail(student.email, student.name, "Dream Fest 2K25", "Your ticket application was rejected.", false);
    console.log(`❌ Rejected student ${student.name} (${student.rollNo})`);

    res.json({ message: "Student rejected successfully", student });
  } catch (error) {
    console.error("❌ Error in rejection:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Verify QR Code (Fixed API Call Issues)
router.post("/verify-qrcode", async (req, res) => {
  const { qrData } = req.body;
  const ALLOWED_TIME_GAP = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

  try {
    if (!qrData) {
      return res.status(400).json({ success: false, message: "QR code data (roll number) is required" });
    }

    const student = await Student.findOne({ rollNo: qrData });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found with this QR code" });
    }

    if (!student.approved) {
      return res.status(400).json({ success: false, message: "Student is not approved yet" });
    }

    const currentTime = new Date();

    if (!student.time) {
      // First-time scan: Allow entry
      student.time = currentTime;
      await student.save();
      return res.status(200).json({ success: true, message: "QR Code verified successfully", student });
    }

    // Calculate the time difference
    const lastScanTime = new Date(student.time);
    const timeDifference = currentTime - lastScanTime; // in milliseconds

    if (timeDifference >= ALLOWED_TIME_GAP) {
      // Enough time has passed, allow access
      student.time = currentTime;
      await student.save();
      return res.status(200).json({ success: true, message: "QR Code verified successfully", student });
    } else {
      // Not enough time has passed, calculate remaining time
      const remainingTime = ALLOWED_TIME_GAP - timeDifference;
      const minutesLeft = Math.ceil(remainingTime / (60 * 1000)); // Convert to minutes
      return res.status(400).json({
        success: false,
        message: "This QR Code is already SCANNED"
      });
    }

  } catch (error) {
    console.error("❌ Error verifying QR code:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});



module.exports = router;
