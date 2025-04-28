import { useState } from "react";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // Track the loading state
  const [error, setError] = useState(""); // Track error messages
  const navigate = useNavigate();

  // ✅ Handle input changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle form submission (updated function)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Start loading

    try {
      console.log("🔹 Attempting login with:", formData); // Debugging
      const response = await loginAdmin(formData); // Send login request

      if (!response || !response.token) {
        console.log("❌ Login failed: No token returned");
        setError("Invalid response from server. Please try again.");
        return;
      }

      console.log("✅ Login successful, token received");
      localStorage.setItem("adminToken", response.token); // Store token
      navigate("/admin/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("❌ Login error: ", error);
      setError(error.response?.data?.message || "Invalid Credentials. Please try again."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Admin Login</h2>
      
      {/* Display error message */}
      {error && <p className="text-red-600 text-center bg-red-100 p-2 rounded mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" />
        
        <button 
          type="submit" 
          className={`bg-blue-600 text-white p-2 w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
          disabled={loading} // Disable button when loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
