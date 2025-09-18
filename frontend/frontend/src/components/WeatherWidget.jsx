import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        setLoading(true);
        const apiKey = "45bbb0cdd496b43fb8ea4c5d5be103c6"; // Replace with your key
        const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        setWeather({
          temp: response.data.main.temp,
          condition: response.data.weather[0].description,
          humidity: response.data.main.humidity,
          location: response.data.name,
        });
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    // ✅ Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Location access denied. Cannot fetch weather.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading weather...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-blue-50 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Weather Info</h3>
      <p className="text-gray-700">Location: {weather.location}</p>
      <p className="text-gray-700">Temperature: {weather.temp}°C</p>
      <p className="text-gray-700 capitalize">Condition: {weather.condition}</p>
      <p className="text-gray-700">Humidity: {weather.humidity}%</p>
    </div>
  );
};

export default WeatherWidget;
