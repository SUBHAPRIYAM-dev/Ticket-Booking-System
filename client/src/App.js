import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import QRScanner from "./pages/QRScanner";
import ProtectedRoute from "./components/ProtectedRoute";
import Success from "./pages/Success";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Show Header on All Pages */}
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/success" element={<Success />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/scan" element={<QRScanner />} /> {/* QRScanner Route */}
            </Route>
          </Routes>
        </main>

        {/* Show Footer on All Pages */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
