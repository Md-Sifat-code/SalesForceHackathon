import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userCredentials = {
      username: credentials.username,
      password: credentials.password,
    };

    try {
      const response = await fetch("https://salesforce-hackathon-s8mr.onrender.com/Log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the received data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);

        // Redirect the user after login
        navigate("/home");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to log in.");
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url("/sciencebg2.jpg")',
      }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm bg-opacity-95">
        <h2 className="text-2xl font-bold text-[#575B91] text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-black mb-1">
              Username
            </label>
            <div className="flex items-center border border-[#575B91] rounded px-3 py-2">
              <FaUser className="text-black mr-2" />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-black mb-1">
              Password
            </label>
            <div className="flex items-center border border-[#575B91] rounded px-3 py-2">
              <FaLock className="text-black mr-2" />
              <input
                type="text"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#575B91] hover:bg-[#46497a] text-white font-semibold py-2 rounded transition duration-200"
          >
            Log In
          </button>
        </form>

        <h1 className="mt-6 text-black font-medium text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#575B91] hover:underline">
            Sign Up
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default Login;
