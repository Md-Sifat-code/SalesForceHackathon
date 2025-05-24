import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("password", formData.password);

      const res = await fetch("https://biggangolpo.onrender.com/User/add", {
        method: "POST",
        body: form,
      });

      let data;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { message: text };
      }

      if (res.ok) {
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/verify", { state: { email: formData.email } });
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/sciencebg.jpg")' }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md bg-opacity-95">
        <h2 className="text-2xl font-bold text-[#575B91] text-center mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-black mb-1">
              Username
            </label>
            <div className="flex items-center border border-red-200 rounded px-3 py-2">
              <FaUser className="text-black mr-2" />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-black mb-1">
              Email
            </label>
            <div className="flex items-center border border-red-200 rounded px-3 py-2">
              <FaEnvelope className="text-black mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-black mb-1">
              Password
            </label>
            <div className="flex items-center border border-red-200 rounded px-3 py-2">
              <FaLock className="text-black mr-2" />
              <input
                type="text"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-black mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-red-200 rounded px-3 py-2">
              <FaLock className="text-black mr-2" />
              <input
                type="text"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 rounded transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#575B91] text-white hover:bg-[#46497a]"
            }`}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <h1 className="mt-6 text-black font-medium text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#575B91] hover:underline">
            Log In
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default Signin;
