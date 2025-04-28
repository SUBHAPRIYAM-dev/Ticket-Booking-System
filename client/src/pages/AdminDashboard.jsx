import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents, approveStudent, rejectStudent } from "../services/api";
import { FiCamera } from "react-icons/fi";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [selectedIdCard, setSelectedIdCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log("🔹 Fetching students...");
        const response = await getStudents();
        console.log("✅ Students data:", response);

        if (!Array.isArray(response)) {
          throw new Error("Invalid students data format");
        }

        setStudents(response);
      } catch (err) {
        console.error("❌ Error fetching students:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleApprove = async (id) => {
    setLoadingActionId(id);
    try {
      await approveStudent(id);
      alert("Student Approved & QR Code Sent!");
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? { ...student, approved: true, rejected: false } : student
        )
      );
    } catch (error) {
      console.error("❌ Error approving student:", error);
      alert("An error occurred while approving the student.");
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleReject = async (id) => {
    setLoadingActionId(id);
    try {
      await rejectStudent(id);
      alert("Student Rejected!");

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === id ? { ...student, approved: false, rejected: true } : student
        )
      );
    } catch (error) {
      console.error("❌ Error rejecting student:", error);
      alert("An error occurred while rejecting the student.");
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleViewIdCard = (idCard) => {
    if (!idCard) {
      console.warn("⚠️ No ID Card found for this student.");
      return;
    }

    // Ensure correct image URL format
    const baseURL = "https://bjxhxmfb-5000.inc1.devtunnels.ms/";
    const formattedUrl = idCard.startsWith("/uploads")
      ? `${baseURL}${idCard.replace(/\\/g, "/")}`
      : idCard;

    console.log("📸 Selected ID Card URL:", formattedUrl);
    setSelectedIdCard(formattedUrl);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <div className="lg:w-1/4 bg-white shadow-md p-6 flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-gray-700 mb-4">QR Code Scanner</h3>
        <button
          onClick={() => navigate("/admin/scan")}
          className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          <FiCamera className="text-xl" />
          Scan QR Code
        </button>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading ? (
          <div className="text-center">Loading students...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2">Name</th>
                  <th className="p-2">Roll No</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">ID Card</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student._id} className="border-b">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.rollNo}</td>
                      <td className="p-2">{student.phone}</td>
                      <td className="p-2">
                        {student.studentIdCard ? (
                          <button
                            onClick={() => handleViewIdCard(student.studentIdCard)}
                            className="text-blue-500 hover:underline"
                          >
                            View ID Card
                          </button>
                        ) : (
                          <span>No ID Card</span>
                        )}
                      </td>
                      <td className="p-2">
                        {student.approved ? (
                          <span className="text-green-600 font-bold">Approved</span>
                        ) : student.rejected ? (
                          <span className="text-red-600 font-bold">Rejected</span>
                        ) : (
                          <span className="text-yellow-500 font-bold">Pending</span>
                        )}
                      </td>
                      <td className="p-2">
                        {!student.approved && !student.rejected ? (
                          <>
                            <button
                              onClick={() => handleApprove(student._id)}
                              className={`p-1 rounded mr-2 ${
                                loadingActionId === student._id
                                  ? "bg-gray-400 text-white"
                                  : "bg-green-500 text-white"
                              }`}
                              disabled={loadingActionId === student._id}
                            >
                              {loadingActionId === student._id ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleReject(student._id)}
                              className={`p-1 rounded ${
                                loadingActionId === student._id
                                  ? "bg-gray-400 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                              disabled={loadingActionId === student._id}
                            >
                              {loadingActionId === student._id ? "Processing..." : "Reject"}
                            </button>
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ ID Card Modal */}
      {showModal && selectedIdCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Student ID Card</h3>
            <img src={selectedIdCard} alt="Student ID Card" className="w-full h-auto object-cover mb-4" />
            <button onClick={() => setShowModal(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
