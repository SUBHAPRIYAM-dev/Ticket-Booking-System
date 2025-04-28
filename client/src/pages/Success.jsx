import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/solid";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 px-4">
      <CheckCircleIcon className="w-24 h-24 text-green-600" />
      <h1 className="text-3xl font-bold text-green-700 mt-4">Payment Successful!</h1>
      <p className="text-gray-600 mt-2 text-center">
        Your registration has been confirmed. Check your email for the ticket and QR code.
      </p>
      <Link to="/" className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
        Back to Home
      </Link>
    </div>
  );
};

export default Success;
