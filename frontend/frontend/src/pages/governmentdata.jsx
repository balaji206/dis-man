// src/pages/GovernmentDataPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const GovernmentDataPage = () => {
  const [disasters, setDisasters] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch disasters from ReliefWeb API
      const disasterRes = await axios.get(
        `https://api.reliefweb.int/v1/disasters?appname=gov-data-app&profile=full&limit=5`
      );
      const formattedDisasters = (disasterRes.data?.data || []).map((item) => ({
        id: item.id,
        title: item.fields?.name || "Unknown",
        date: item.fields?.date?.created || "N/A",
        description: item.fields?.description || "No description available",
        country:
          item.fields?.country?.map((c) => c.name).join(", ") || "Global",
      }));
      setDisasters(formattedDisasters);

      // Fetch current weather using Open-Meteo (No API key needed)
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true`
      );
      setWeather(weatherRes.data.current_weather);
    } catch (err) {
      console.error("Error fetching data", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <motion.h1
        className="text-4xl font-bold text-blue-900 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Government API Data
      </motion.h1>

      {loading && <p className="text-lg">Loading data...</p>}

      {!loading && (
        <>
          {/* Weather Section */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Current Weather (Delhi)
            </h2>
            {weather ? (
              <p>
                🌡 Temperature: {weather.temperature}°C  
                💨 Wind: {weather.windspeed} km/h
              </p>
            ) : (
              <p>No weather data available.</p>
            )}
          </motion.div>

          {/* Disasters Section */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              Disasters (ReliefWeb)
            </h2>
            <ul className="space-y-4">
              {disasters.map((d) => (
                <li
                  key={d.id}
                  className="border-l-4 border-red-400 pl-4 shadow-sm bg-gray-50 p-3 rounded"
                >
                  <h3 className="text-lg font-bold">{d.title}</h3>
                  <p className="text-sm text-gray-600">
                    📅 {d.date} | 🌍 {d.country}
                  </p>
                  <p className="mt-1 text-gray-700">{d.description}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default GovernmentDataPage;
