import axios from "axios";

// ✅ Create an axios instance with the base URL for API
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// ✅ Attach Authorization Token to Every Request (Except Login)
API.interceptors.request.use(
  (config) => {
    if (config.url !== "/admin/login") {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No admin token found! API request may fail.");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Admin Login
export const loginAdmin = async (data) => {
  try {
    console.log("🔹 Sending login request with data:", data);
    const response = await API.post("/admin/login", data);
    console.log("✅ Login API response:", response.data);

    if (!response.data || !response.data.token) {
      throw new Error("Invalid response structure from server");
    }

    localStorage.setItem("adminToken", response.data.token);
    return response.data;
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Fetch Students for Admin (Fixing ID Card URL Issue)
export const getStudents = async () => {
  try {
    console.log("🔹 Fetching students for admin...");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      throw new Error("Admin not authenticated. Please log in.");
    }

    const response = await API.get("/students");
    console.log("✅ Students API response:", response.data);

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response format: Expected an array");
    }

    // ✅ Ensure studentIdCard URLs are correctly formatted
    const baseURL = "http://localhost:5000";
    const studentsWithFullImageURL = response.data.map((student) => ({
      ...student,
      studentIdCard: student.studentIdCard
        ? `${baseURL}/${student.studentIdCard.replace(/\\/g, "/")}` // ✅ Fix `\` to `/`
        : null,
    }));

    return studentsWithFullImageURL;
  } catch (error) {
    console.error(
      "❌ Error fetching students:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Register a Student (Ensures multipart/form-data handling)
export const registerStudent = async (data) => {
  try {
    console.log("🔹 Sending registration request with data:", data);

    // Ensure you have the correct endpoint and it's not missing from the server-side.
    const response = await API.post("/students/register", data, {
      headers: {
        "Content-Type": "multipart/form-data", // This ensures the form data is correctly processed.
      },
    });

    if (!response.data) throw new Error("Invalid response from server");

    console.log("✅ Register student API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error registering student:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Approve a Student
export const approveStudent = async (id) => {
  try {
    const response = await API.put(`/admin/approve/${id}`);
    if (!response.data) throw new Error("Invalid response from server");
    return response.data;
  } catch (error) {
    console.error("❌ Error approving student:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Reject a Student
export const rejectStudent = async (id) => {
  try {
    const response = await API.put(`/admin/reject/${id}`);
    if (!response.data) throw new Error("Invalid response from server");
    return response.data;
  } catch (error) {
    console.error("❌ Error rejecting student:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Verify QR Code (Fixing API Call Issues)
export const verifyQRCode = async (rollNo) => {
  try {
    if (!rollNo) {
      throw new Error("Missing roll number for verification");
    }

    console.log("📡 Sending QR Code for verification:", { qrData: rollNo });

    // ✅ Ensure `qrData` is sent correctly
    const response = await API.post("/verify-qrcode", { qrData: rollNo });

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response format from server");
    }

    console.log("✅ QR Code verified successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Server Error:", error.response.status, error.response.data);
      throw new Error(error.response.data.message || "Server Error");
    } else if (error.request) {
      console.error("❌ No Response from Server");
      throw new Error("No response from server. Check if the backend is running.");
    } else {
      console.error("❌ Network Error:", error.message);
      throw new Error("Network error. Please check your connection.");
    }
  }
};

