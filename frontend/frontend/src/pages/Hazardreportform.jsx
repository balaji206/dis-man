import React, { useState } from "react";
import axios from "axios";

export default function HazardReportForm({ onReportSubmit }) {
  const [type, setType] = useState("Flood");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleGPS = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      },
      () => alert("Unable to fetch GPS location")
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/hazard-reports", { type, description, location })
      .then((res) => {
        alert("Report submitted successfully!");
        if (onReportSubmit) onReportSubmit(res.data);
        setDescription("");
        setLocation("");
      })
      .catch(() => alert("Error submitting report"));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-4 space-y-3"
    >
      <h2 className="text-xl font-semibold">Report Hazard</h2>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded-lg p-2 w-full"
      >
        <option>Flood</option>
        <option>Fire</option>
        <option>Road Block</option>
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the hazard..."
        className="border rounded-lg p-2 w-full"
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (lat, lon or address)"
          className="border rounded-lg p-2 flex-grow"
        />
        <button
          type="button"
          onClick={handleGPS}
          className="bg-blue-500 text-white px-3 rounded-lg"
        >
          Use GPS
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Submit Report
      </button>
    </form>
  );
}
