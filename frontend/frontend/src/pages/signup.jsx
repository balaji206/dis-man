import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Import Background Images
import bg1 from "../assets/eddy-boom-aAdlw9rNqfk-unsplash.jpg";
import bg2 from "../assets/nikolas-noonan-n_3kdpSkrJo-unsplash.jpg";
import bg3 from "../assets/purnomo-capunk-KZC7BJo0Cl0-unsplash.jpg";
import bg4 from "../assets/marc-szeglat-I1MGVZ42wnU-unsplash.jpg";

const Signup = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const backgroundImages = [bg1, bg2, bg3, bg4];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Auto-change background every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      console.log("Signup Success:", res.data);
      alert("Signup successful! Redirecting to login...");
      navigate("/login"); // ✅ Redirect to login after signup
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ✅ Background Slideshow */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${backgroundImages[currentImage]})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/30 transition font-semibold shadow-md"
      >
        Back
      </button>

      {/* ✅ Glassmorphism Signup Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white drop-shadow-lg">
          Create Your Account
        </h2>

        {/* ✅ Error Message */}
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* ✅ Signup Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition shadow-lg"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* ✅ Login Link */}
        <p className="text-center mt-6 text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-200 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
