import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DisasterAlert() {
  const [status, setStatus] = useState("");
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          }),
        () => setStatus("⚠️ Unable to fetch your location")
      );
    } else {
      setStatus("⚠️ Geolocation not supported");
    }
  }, []);

  const triggerAlert = async () => {
  if (!coords) {
    setStatus("⚠️ Location not available");
    return;
  }

  setStatus("⏳ Sending alert...");

  try {
    const res = await axios.post("http://localhost:5000/api/disaster-alert", coords);

    setStatus(res.data.status);
  } catch (err) {
    console.error(err);
    setStatus("⚠️ Failed to trigger alert");
  }
};

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-3">📢 Disaster Alert System</h2>

      <button
        onClick={triggerAlert}
        className="mb-3 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Send Disaster Alert
      </button>

      {status && (
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{status}</pre>
      )}
    </div>
  );
}
