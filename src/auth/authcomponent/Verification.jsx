import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_api_url;

const Verification = () => {
  const location = useLocation();
  const email = location.state?.email;

  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!email) {
      setError("Email not found. Please go back and try again.");
      return;
    }

    setLoading(true);
    setError("");
    const otpCode = otp.join("");

    try {
      const response = await fetch(
        `https://biggangolpo.onrender.com/User/validate?email=${email}&otp=${otpCode}`,
        {
          method: "POST",
        }
      );

      const textResponse = await response.text();

      if (!response.ok) {
        throw new Error(textResponse || "OTP verification failed.");
      }

      alert(textResponse);
      navigate("/login"); // or navigate to dashboard, etc.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgland">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Enter Verification Code
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We sent a 6-digit code to <b>{email || "your email"}</b>. Enter it
          below.
        </p>

        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-semibold"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleVerify}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default Verification;