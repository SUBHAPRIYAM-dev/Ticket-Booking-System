import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${eventId}`).then((response) => {
      setEvent(response.data);
    });
  }, [eventId]);

  const handlePayment = async () => {
    const userId = localStorage.getItem("userId"); // Assume user is logged in
    const response = await axios.post("http://localhost:5000/api/payment/create-order", {
      eventId,
      studentId: userId,
      amount: event.registrationFee,
    });

    const options = {
      key: "RAZORPAY_KEY_ID",
      amount: event.registrationFee * 100,
      currency: "INR",
      name: event.name,
      description: "Event Registration",
      order_id: response.data.orderId,
      handler: async function (response) {
        await axios.post("http://localhost:5000/api/payment/verify-payment", {
          eventId,
          studentId: userId,
          qrCode: `QR_${userId}_${eventId}`, // Unique QR code
        });

        alert("Payment Successful! Ticket Booked.");
        window.location.href = "/success";
      },
      prefill: {
        email: localStorage.getItem("email"),
        contact: localStorage.getItem("phone"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-6">
      {event ? (
        <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
          <img src={event.eventPhoto} alt={event.name} className="w-full h-60 object-cover rounded-lg" />
          <h1 className="text-2xl font-bold mt-4">{event.name}</h1>
          <p className="text-gray-600">{event.description}</p>
          <p className="text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
          <p className="text-gray-800 font-bold">Venue: {event.venue}</p>
          <p className="text-blue-700 font-bold">Fee: ₹{event.registrationFee}</p>
          
          {event.registrationFee > 0 ? (
            <button onClick={handlePayment} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
              Register & Pay
            </button>
          ) : (
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md">Register for Free</button>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EventDetails;
