import { useState, useEffect } from "react";
import { registerStudent } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    branch: "",
    email: "",
    phone: "",
    studentIdCard: null, // Keep the same field name
  });

  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(true); // State for modal visibility

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input correctly
  const handleFileChange = (e) => {
    setFormData({ ...formData, studentIdCard: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const formDataObj = new FormData();

    // Append only non-null values
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataObj.append(key, value);
    });

    console.log("🔹 FormData before sending:", [...formDataObj.entries()]); // Debugging

    try {
      const response = await registerStudent(formDataObj); // Pass the FormData object here
      setMessage({ type: "success", text: "Student registered successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Error registering." });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Book your Ticket</h2>

      {message && (
        <p className={`p-3 text-white ${message.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {message.text}
        </p>
      )}

      {/* Modal for initial message */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm">
            <p className="text-lg font-semibold text-red-600">
              Please provide your Roll No / Registration Number as mentioned on your ID card. 
              Use a valid email ID and phone no. and upload a clear picture of your ID card in the relevant field.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number"
          value={formData.rollNo}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <p className="text-sm text-red-500">*Upload a clear picture of your ID card</p>
        <p className="text-sm text-gray-500">
          *Supported formats: jpg, jpeg, png. Max file size: 5MB.
        </p>
        <input
          type="file"
          name="studentIdCard"
          onChange={handleFileChange}
          className="w-full p-2 border"
          required
        />
       

        <button type="submit" className="bg-blue-600 text-white p-2 w-full">
          Book Ticket
        </button>
      </form>
    </div>
  );
};

export default Register;
