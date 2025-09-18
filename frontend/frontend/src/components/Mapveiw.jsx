import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

function LocationMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng }); // ✅ Use lng
    }
  });
  return null;
}

const MapView = ({ location, setLocation, disasters }) => {
  return (
    <MapContainer
      center={[location.lat, location.lng]} // ✅ Use lng
      zoom={5}
      style={{ height: "450px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]}>
        <Popup>Your Selected Location</Popup>
      </Marker>
      {disasters.map((d, i) => (
        <Marker key={i} position={[d.lat, d.lng]}> {/* ✅ Use d.lng */}
          <Popup>
            <strong>{d.title}</strong><br />
            {d.country} - {d.date}
          </Popup>
        </Marker>
      ))}
      <LocationMarker setLocation={setLocation} />
    </MapContainer>
  );
};

export default MapView;
