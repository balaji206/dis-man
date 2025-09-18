import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Import background images
import bg1 from "../assets/eddy-boom-aAdlw9rNqfk-unsplash.jpg";
import bg2 from "../assets/nikolas-noonan-n_3kdpSkrJo-unsplash.jpg";
import bg3 from "../assets/purnomo-capunk-KZC7BJo0Cl0-unsplash.jpg";
import bg4 from "../assets/marc-szeglat-I1MGVZ42wnU-unsplash.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const backgroundImages = [bg1, bg2, bg3, bg4];

  // Auto-change background every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Please enter both email and password.");
    return;
  }

  // ✅ Simulate login success
  const username = email.split("@")[0]; // Example: john@example.com → john
  localStorage.setItem("token", "dummy-auth-token");
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userName", username); // ✅ Store username

  // ✅ Redirect to Home page
  navigate("/");
};



  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background slideshow */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${backgroundImages[currentImage]})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/70"></div>
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/30 transition font-semibold shadow-md"
      >
        Back
      </button>

      {/* Glassmorphism Login Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-4xl font-extrabold mb-4 text-center">Welcome Back</h2>
        <p className="text-center text-gray-200 mb-6">Login to your account</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100/80 text-red-600 text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />


          <button
            type="submit"
            className="w-full py-3  bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-300 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gray-200 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
