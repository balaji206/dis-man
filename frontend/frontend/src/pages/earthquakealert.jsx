import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function EarthquakeAlert() {
  const [coords, setCoords] = useState(null);

  // Get user GPS
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => alert("Unable to fetch GPS location")
    );
  }, []);

  // Connect to server and listen for earthquake alerts
  useEffect(() => {
    if (!coords) return;

    const socket = io("http://localhost:5000", {
      query: { lat: coords.lat, lon: coords.lon },
    });

    socket.on("earthquake-alert", (alerts) => {
      alerts.forEach((eq) => {
        alert(eq.msg); // show earthquake alert message
      });
    });

    return () => socket.disconnect();
  }, [coords]);

  return null; // Component does not render anything
}
