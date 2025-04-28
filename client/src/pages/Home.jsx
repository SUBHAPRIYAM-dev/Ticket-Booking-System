import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/events/all")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-6 relative bg-gray-100"
      style={{ backgroundImage: "url('/assets/home.webp')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
      <div className="relative bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
          Welcome to Dream Fest 2K25 🎉
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700">
          Book your tickets now and be part of the biggest college fest!
        </p>
        <button
          onClick={() => navigate("/register")}
          className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </div>

      <h2 className="text-3xl font-bold text-white mt-12 relative">College Events</h2>
      <div className="grid md:grid-cols-3 gap-6 mt-6 w-full max-w-5xl relative">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="bg-white p-4 rounded-lg shadow-lg">
              <img src={event.eventPhoto} alt={event.name} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
              <Link to={`/event/${event._id}`} className="mt-2 block text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-white text-center w-full">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
