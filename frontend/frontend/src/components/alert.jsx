import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bg from "../assets/olympicfire_oli_20250812_lrg.jpg";

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const OPENWEATHER_API_KEY = "45bbb0cdd496b43fb8ea4c5d5be103c6"; // Replace with your key

const openWeatherLayers = [
  { id: "temp_new", name: "Temperature" },
  { id: "precipitation_new", name: "Precipitation" },
  { id: "clouds_new", name: "Clouds" },
  { id: "pressure_new", name: "Pressure" },
  { id: "wind_new", name: "Wind" },
  { id: "snow_new", name: "Snow" },
  { id: "rain_new", name: "Rain" },
  { id: "humidity_new", name: "Humidity" },
  { id: "dewpoint_new", name: "Dew Point" },
  { id: "sea_level_new", name: "Sea Level" },
  { id: "ice_new", name: "Ice" },
  { id: "weather_new", name: "Weather" },
  { id: "uv_new", name: "UV Index" },
  { id: "clouds_daily", name: "Clouds Daily" },
  { id: "temp_daily", name: "Temp Daily" },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch alerts from ReliefWeb
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          "https://api.reliefweb.int/v1/disasters?appname=disaster-app&profile=full&preset=latest"
        );
        const data = await response.json();

        const parsedAlerts = data.data.slice(0, 10).map((item) => {
          const geo = item.fields.geo
            ? item.fields.geo[0].geometry.coordinates
            : [78.9629, 20.5937];
          return {
            id: item.id,
            type: item.fields.type[0]?.name || "General",
            location: item.fields.country[0]?.name || "Unknown",
            severity: "Moderate",
            time: new Date(item.fields.date.created).toLocaleString(),
            coords: [geo[1], geo[0]], // Leaflet uses [lat, lng]
          };
        });

        setAlerts(parsedAlerts);
        setLoading(false);
        toast.success("Disaster alerts updated!", {
          position: "bottom-right",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load alerts");
      }
    };

    fetchAlerts();
  }, []);

  const severityColors = {
    High: "bg-red-500",
    Extreme: "bg-purple-600",
    Moderate: "bg-yellow-500",
    Low: "bg-green-500",
  };

  return (
    <div
  className="min-h-screen text-white px-6 py-10 relative"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>

      {/* Dark transparent overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>


      {/* Content */}
      <div className="relative z-10">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Disaster Alerts
        </motion.h1>
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/30 transition font-semibold shadow-md"
        >
          Back
        </button>

        {loading ? (
          <p className="text-center text-lg">Loading alerts...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white/80 text-blue-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{alert.type}</h2>
                  <span
                    className={`text-white text-xs font-bold px-3 py-1 rounded-full ${
                      severityColors[alert.severity]
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">📍 {alert.location}</p>
                <p className="text-gray-500 text-sm">⏱ {alert.time}</p>
              </div>
            ))}
          </div>
        )}

        <div className="w-full max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-lg overflow-hidden">
          <h2 className="text-blue-800 font-bold text-center py-4 text-2xl">
            Alert Locations & Weather Layers
          </h2>

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={3}
            style={{ height: "500px", width: "100%" }}
          >
            <LayersControl position="topright">
              {/* Base OpenStreetMap */}
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
              </LayersControl.BaseLayer>

              {/* OpenWeather Layers */}
              {openWeatherLayers.map((layer) => (
                <LayersControl.Overlay
                  key={layer.id}
                  name={layer.name}
                  checked={false}
                >
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/${layer.id}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}&opacity=0.6`}
                    attribution="&copy; OpenWeatherMap"
                  />
                </LayersControl.Overlay>
              ))}

              {/* Alert Markers */}
              {alerts.map((alert) => (
                <Marker key={alert.id} position={alert.coords}>
                  <Popup>
                    <strong>{alert.type}</strong>
                    <br />
                    {alert.location}
                    <br />
                    Severity: {alert.severity}
                  </Popup>
                </Marker>
              ))}
            </LayersControl>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
