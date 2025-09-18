import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null; // Avoid rendering before redirect

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-400 text-gray-800 p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
      >
        Back
      </button>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Profile</h1>
        <p className="text-lg mb-2">
          <strong>Username:</strong> {userName || "N/A"}
        </p>
        <p className="text-lg mb-6">
          <strong>Email:</strong> {userEmail}
        </p>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userEmail");
              localStorage.removeItem("userName");
              navigate("/");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
