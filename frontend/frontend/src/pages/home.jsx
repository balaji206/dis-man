import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaUserCircle } from "react-icons/fa";
import guardiaIcon from '../assets/girl.png';
// ✅ Background Images
import bg1 from "../assets/eddy-boom-aAdlw9rNqfk-unsplash.jpg";
import bg2 from "../assets/nikolas-noonan-n_3kdpSkrJo-unsplash.jpg";
import bg3 from "../assets/purnomo-capunk-KZC7BJo0Cl0-unsplash.jpg";
import bg4 from "../assets/marc-szeglat-I1MGVZ42wnU-unsplash.jpg";

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const backgroundImages = [bg1, bg2, bg3, bg4];
  const isLoggedIn = !!localStorage.getItem("token");

  // ✅ Auto-change background every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { title: "Real-Time Alerts", desc: "Stay updated with instant disaster alerts and early warnings." },
    { title: "Risk Prediction", desc: "Predict and mitigate disasters using AI-driven analytics." },
    { title: "Emergency Resources", desc: "Access emergency contacts and nearby relief centers quickly." },
    { title: "Community Support", desc: "Connect with local volunteers and disaster response teams." },
    { title: "Weather Insights", desc: "Get accurate weather forecasts and warnings in real-time." },
    { title: "Resource Locator", desc: "Find shelters, hospitals, and emergency supply stores instantly." },
  ];

  const testimonials = [
    { name: "John Doe", role: "Community Leader", text: "This platform saved our lives during the floods. Timely alerts made all the difference!" },
    { name: "Sarah Smith", role: "Relief Volunteer", text: "Connecting with communities during disasters has never been this easy and efficient." },
    { name: "Mike Brown", role: "Resident", text: "Accurate weather forecasts and alert systems helped us prepare early. Highly recommended!" },
  ];

  return (
    <div className="flex flex-col text-white font-sans">
      {/* ✅ Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm z-50">
        <h1 className="text-2xl font-extrabold tracking-wide text-white drop-shadow-md">Disaster Response Coordination Platform</h1>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex gap-4 text-white font-medium items-center">
          <Link to="/" className="px-4 py-2 rounded-md hover:bg-blue-600 transition">Home</Link>
          <Link to="/dashboard" className="px-4 py-2 rounded-md hover:bg-blue-600 transition">Dashboard</Link>
          <Link to="/alerts" className="px-4 py-2 rounded-md hover:bg-blue-600 transition">Alerts</Link>

          {isLoggedIn ? (
            <>
              {/* ✅ Profile Icon */}

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userEmail");
                  window.location.href = "/";
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white transition"
              >
                Logout
              </button>
              <Link to="/profile" className="flex items-center hover:text-cyan-400 transition">
                <FaUserCircle size={28} />
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-md hover:bg-blue-600 transition">Login</Link>
              <Link to="/signup" className="px-4 py-2 rounded-md hover:bg-blue-600 transition">Signup</Link>
            </>
          )}
        </div>

        {/* ✅ Mobile Menu Icon */}
        <div className="md:hidden text-3xl text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </nav>

      {/* ✅ Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed top-16 left-0 w-full bg-black/80 text-white flex flex-col items-center gap-6 py-6 md:hidden z-50">
          <Link to="/" className="hover:text-cyan-400" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/dashboard" className="hover:text-cyan-400" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/alerts" className="hover:text-cyan-400" onClick={() => setMenuOpen(false)}>Alerts</Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="hover:text-cyan-400" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userEmail");
                  window.location.href = "/";
                }}
                className="bg-red-500 px-6 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-cyan-400" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="hover:text-cyan-400" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}

      {/* ✅ Hero Section with Background Slideshow */}
      <section className="relative min-h-screen flex items-center justify-start text-left px-6 md:px-16 py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${backgroundImages[currentImage]})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>

        <div className="relative z-10 mt-20 max-w-xl bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
            Disaster Management System
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Real-time alerts, weather insights, and predictive analytics to keep you safe and informed.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link to="/dashboard" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-cyan-600 transition">
              Go to Dashboard
            </Link>
            <Link to="/alerts" className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold shadow-lg border border-white/30 hover:bg-white/20 transition">
              View Alerts
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Features Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-800">Key Features</h2>
          <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
            Explore the core functionalities of our Disaster Management System designed to keep you safe.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition transform duration-300 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-2xl font-bold">{index + 1}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Testimonials Section */}
      <section className="from-blue-50 to-white text-gray-200 py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-blue-400">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((t, index) => (
              <div key={index} className="bg-blue-600 hover:bg-blue-500 p-6 rounded-lg shadow-lg">
                <p className="italic mb-4">"{t.text}"</p>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-blue-200">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Call to Action */}
      <section className="from-blue-200 to-blue-300 text-gray-700 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Join Us Today</h2>
        <p className="mb-6 text-lg">Get real-time alerts and help your community stay safe.</p>
        <Link to="/signup" className="bg-white text-blue-500 font-bold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
          Sign Up Now
        </Link>
      </section>

      {/* ✅ Footer */}
<footer className="bg-blue-950 py-10 text-center text-blue-200">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left px-6">
    
    {/* About DMS */}
    <div>
      <h3 className="text-xl font-bold mb-4 text-white">About DMS</h3>
      <p className="text-sm">
        Disaster Management System helps communities prepare, respond, and recover from disasters using technology-driven solutions.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li><Link to="/about" className="hover:text-cyan-400">About Us</Link></li>
        <li><Link to="/faq" className="hover:text-cyan-400">FAQs</Link></li>
        <li><Link to="/privacy" className="hover:text-cyan-400">Privacy Policy</Link></li>
        <li><Link to="/terms" className="hover:text-cyan-400">Terms & Conditions</Link></li>
      </ul>
    </div>

    {/* Contact Section */}
    <div>
      <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <span className="font-semibold text-cyan-400">Email:</span>{" "}
          <a href="mailto:support@dms.com" className="hover:text-cyan-300">support@dms.com</a>
        </li>
        <li>
          <span className="font-semibold text-cyan-400">Phone:</span>{" "}
          <a href="tel:+11234567890" className="hover:text-cyan-300">+1 123-456-7890</a>
        </li>
      </ul>
      <div className="mt-4 flex gap-4 text-lg">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400"><FaFacebookF /></a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400"><FaTwitter /></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400"><FaLinkedinIn /></a>
        <a href="mailto:support@dms.com" className="hover:text-cyan-400"><FaEnvelope /></a>
      </div>
    </div>

  </div>

  {/* Bottom Note */}
  <p className="text-sm mt-8">© {new Date().getFullYear()} Disaster Management System. All rights reserved.</p>
</footer>
<Link
  to="/assistant"
  className="fixed bottom-6 right-6 z-50 group"
>
  <div className="relative flex items-center justify-center">
    {/* Guardia Icon */}
    <img
      src={guardiaIcon}
      alt="Guardia"
      className="w-16 h-16 rounded-full shadow-lg cursor-pointer hover:scale-105 transition"
    />

    {/* Tooltip */}
    <span className="absolute right-20 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Hi, I am Guardia
    </span>
  </div>
</Link>
    </div>
  );
};

export default Home;
