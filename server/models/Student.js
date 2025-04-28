const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  studentIdCard: { type: String, required: true }, // Ensure ID Card is required
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false }, // ✅ Ensure rejected field exists
  qrCode: { type: String, default: "" },
  time: { type: Date, default: null }, // ✅ Ensure time field exists
});

module.exports = mongoose.model("Student", StudentSchema);