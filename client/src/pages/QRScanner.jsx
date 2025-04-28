import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BrowserMultiFormatReader } from "@zxing/browser";

const QRScanner = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scannedData, setScannedData] = useState(null);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isNextScanVisible, setIsNextScanVisible] = useState(false);
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      stopCamera();

      codeReader.current = new BrowserMultiFormatReader();

      const constraints = {
        video: {
          facingMode: window.innerWidth > 768 ? "user" : "environment",
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      codeReader.current.decodeFromStream(stream, videoRef.current, (result, err) => {
        if (result && isScanningEnabled) {
          handleScan(result.getText());
        }
        if (err && err.name !== "NotFoundException") {
          setError(err.message || "Unknown error while scanning.");
        }
      });

      setError("");
    } catch (err) {
      console.error("Camera Access Error:", err);
      setError(
        err.name === "NotAllowedError"
          ? "Camera access is blocked. Please allow camera permissions."
          : "Unable to access camera. Please check your settings."
      );
    }
  };

  const stopCamera = () => {
    if (codeReader.current) {
      codeReader.current.stopContinuousDecode?.();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleScan = (data) => {
    if (data && isScanningEnabled) {
      console.log("Scanned QR Code:", data);
      setScannedData(data);
      setIsScanningEnabled(false);
      setIsSubmitVisible(true);
    }
  };

  const submitData = async () => {
    try {
      setIsSubmitDisabled(true);
      const response = await axios.post("http://localhost:5000/api/admin/verify-qrcode", { qrData: scannedData });

      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response format from server.");
      }

      if (response.data.success) {
        setSuccess("Successfully scanned! The QR code is valid.");
      } else {
        setError(response.data.message || "Ticket verification failed.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Unknown error.";
      console.error("Error verifying ticket:", errorMessage);

      if (err.response) {
        if (err.response.status === 404) {
          setError("No student found for this QR code.");
        } else if (err.response.status === 400) {
          setError(errorMessage);
        } else {
          setError("Server error. Please try again later.");
        }
      } else if (err.request) {
        setError("No response from server. Check network connection.");
      } else {
        setError("Unknown error occurred. Please try again.");
      }
    } finally {
      setIsSubmitVisible(false);
      setIsNextScanVisible(true);
      setIsSubmitDisabled(false);
    }
  };

  const resetScanner = () => {
    setSuccess("");
    setError("");
    setScannedData(null);
    setIsScanningEnabled(true);
    setIsSubmitVisible(false);
    setIsNextScanVisible(false);
  };

  const handleBack = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">QR Code Scanner</h2>
        <div className="relative mb-4">
          <video ref={videoRef} autoPlay muted width="100%" height="auto" style={{ borderRadius: "8px", border: "2px solid #ddd", maxHeight: "400px" }} />
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {isSubmitVisible && (
          <button onClick={submitData} disabled={isSubmitDisabled} className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
            {isSubmitDisabled ? "Submitting..." : "Submit"}
          </button>
        )}
        {isNextScanVisible && (
          <button onClick={resetScanner} className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">Next Scan</button>
        )}
        <button onClick={handleBack} className="w-full py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4">Back to Dashboard</button>
      </div>
    </div>
  );
};

export default QRScanner;