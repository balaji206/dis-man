// WeatherMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const WeatherMap = ({ location }) => {
  const [alerts, setAlerts] = useState([]);
  const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // Centered over India for example
  const mapCenter = location || defaultLocation;

  const OWM_API_KEY = "YOUR_API_KEY"; // OpenWeatherMap API key

  useEffect(() => {
    // Fetch weather alerts (cyclones, storms, floods)
    const fetchAlerts = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/3.0/alerts?lat=${mapCenter.lat}&lon=${mapCenter.lng}&appid=${OWM_API_KEY}`
        );
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };

    fetchAlerts();
  }, [mapCenter.lat, mapCenter.lng]);

  return (
    <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={5} style={{ height: "500px", width: "100%" }}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>

        {/* Weather overlays */}
        <LayersControl.Overlay name="Precipitation">
          <LayerGroup>
            <TileLayer
              url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=45bbb0cdd496b43fb8ea4c5d5be103c6&units=metric`}
              opacity={0.5}
            />
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Clouds (Storms)">
          <LayerGroup>
            <TileLayer
              url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=45bbb0cdd496b43fb8ea4c5d5be103c6&units=metric`}
              opacity={0.5}
            />
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Wind">
          <LayerGroup>
            <TileLayer
              url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=45bbb0cdd496b43fb8ea4c5d5be103c6&units=metric`}
              opacity={0.5}
            />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      {/* Alerts (e.g., cyclones) */}
      {alerts.map((alert, index) => (
        <Marker
          key={index}
          position={[alert.lat || mapCenter.lat, alert.lon || mapCenter.lng]} // fallback if lat/lon not provided
        >
          <Popup>
            <strong>{alert.event}</strong>
            <br />
            {alert.description}
            <br />
            <em>{alert.start ? new Date(alert.start * 1000).toLocaleString() : ""}</em> -{" "}
            <em>{alert.end ? new Date(alert.end * 1000).toLocaleString() : ""}</em>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WeatherMap;
