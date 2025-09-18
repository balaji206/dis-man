// src/pages/DisasterPredictorPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const DisasterPredictorPage = () => {
  const [gdacsEvents, setGdacsEvents] = useState([]);
  const [allGdacsEvents, setAllGdacsEvents] = useState([]);
  const [earthquakes, setEarthquakes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [cityPredictions, setCityPredictions] = useState([]);
  const [coords, setCoords] = useState({ lat: 13.0827, lon: 80.2707 }); // Default Chennai
  const [errorMsg, setErrorMsg] = useState(null);

  const OPENWEATHER_API_KEY = "45bbb0cdd496b43fb8ea4c5d5be103c6";

  const parseLocation = (title, description, item) => {
    let countryNode =
      item.getElementsByTagName("country")[0] ||
      item.querySelector("*[local-name='country']");
    if (countryNode && countryNode.textContent.trim()) {
      return countryNode.textContent.trim();
    }

    let locationNode =
      item.getElementsByTagName("location")[0] ||
      item.querySelector("*[local-name='location']");
    if (locationNode && locationNode.textContent.trim()) {
      return locationNode.textContent.trim();
    }

    const titleMatch = title.match(/ in ([A-Za-z\s]+)/i);
    if (titleMatch && titleMatch[1]) return titleMatch[1].trim();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = description;
    const textDesc = tempDiv.textContent || "";
    const descMatch = textDesc.match(/in\s+([A-Za-z\s]+)/i);
    if (descMatch && descMatch[1]) return descMatch[1].trim();

    return "Unknown Location";
  };

  const fetchGDACS = () => {
    fetch("https://api.allorigins.win/raw?url=https://www.gdacs.org/xml/rss.xml")
      .then((res) => res.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((xml) => {
        const items = Array.from(xml.querySelectorAll("item")).map((item) => {
          const title = item.querySelector("title")?.textContent || "";
          const description =
            item.querySelector("description")?.textContent || "";
          return {
            title,
            description,
            location: parseLocation(title, description, item),
          };
        });
        setAllGdacsEvents(items);
        setGdacsEvents(items.slice(0, 5));
      })
      .catch((err) => {
        console.error("GDACS fetch failed:", err);
      });
  };

  const fetchData = () => {
    fetchGDACS();

    // Earthquakes
    axios
      .get(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      )
      .then((res) => setEarthquakes(res.data.features));

    // Weather
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      )
      .then((res) => setWeather(res.data))
      .catch(() => setWeather(null));
  };

  useEffect(() => {
    fetchData();
  }, [coords]);

  // Global predictions
  useEffect(() => {
    const preds = [];

    gdacsEvents.forEach((event) => {
      const lowerTitle = event.title.toLowerCase();
      if (lowerTitle.includes("flood")) {
        preds.push({
          hazard: "Flood",
          probability: "High",
          reason: "Recent GDACS flood alert",
          location: event.location,
        });
      }
      if (lowerTitle.includes("storm")) {
        preds.push({
          hazard: "Storm",
          probability: "High",
          reason: "Recent GDACS storm alert",
          location: event.location,
        });
      }
      if (lowerTitle.includes("earthquake")) {
        preds.push({
          hazard: "Earthquake",
          probability: "Moderate",
          reason: "Recent GDACS earthquake activity nearby.",
          location: event.location,
        });
      }
    });

    earthquakes.forEach((eq) => {
      if (eq.properties.mag >= 5.5) {
        preds.push({
          hazard: "Earthquake",
          probability: "High",
          reason: `Magnitude ${eq.properties.mag} earthquake reported.`,
          location: eq.properties.place || "Unknown Location",
        });
      }
    });

    if (weather?.list) {
      const city = weather.city.name;
      const heavyRain = weather.list.some(
        (w) => w.rain && w.rain["3h"] > 20
      );
      if (heavyRain) {
        preds.push({
          hazard: "Flood",
          probability: "Moderate",
          reason: "Heavy rainfall predicted",
          location: city,
        });
      }
      const strongWind = weather.list.some(
        (w) => w.wind && w.wind.speed > 20
      );
      if (strongWind) {
        preds.push({
          hazard: "Storm",
          probability: "Moderate",
          reason: "High wind speeds predicted",
          location: city,
        });
      }
    }

    setPredictions(preds);
  }, [gdacsEvents, earthquakes, weather]);

  // Search & City predictions
  const handleSearch = () => {
    if (!searchLocation.trim()) return;
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          searchLocation
        )}&limit=1&appid=${OPENWEATHER_API_KEY}`
      )
      .then((res) => {
        if (res.data.length > 0) {
          const lat = res.data[0].lat;
          const lon = res.data[0].lon;
          setErrorMsg(null);

          // Fetch weather for searched city
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
            )
            .then((wRes) => {
              const cityWeather = wRes.data;
              const preds = [];

              // Match GDACS alerts for this city
              const cityLower = searchLocation.toLowerCase();
              allGdacsEvents.forEach((event) => {
                if (event.location.toLowerCase().includes(cityLower)) {
                  const lowerTitle = event.title.toLowerCase();
                  if (lowerTitle.includes("flood")) {
                    preds.push({
                      hazard: "Flood",
                      probability: "High",
                      reason: "Recent GDACS flood alert",
                      location: event.location,
                    });
                  }
                  if (lowerTitle.includes("storm")) {
                    preds.push({
                      hazard: "Storm",
                      probability: "High",
                      reason: "Recent GDACS storm alert",
                      location: event.location,
                    });
                  }
                  if (lowerTitle.includes("earthquake")) {
                    preds.push({
                      hazard: "Earthquake",
                      probability: "Moderate",
                      reason: "Recent GDACS earthquake activity nearby.",
                      location: event.location,
                    });
                  }
                }
              });

              // Weather-based predictions
              const heavyRain = cityWeather.list.some(
                (w) => w.rain && w.rain["3h"] > 20
              );
              if (heavyRain) {
                preds.push({
                  hazard: "Flood",
                  probability: "Moderate",
                  reason: "Heavy rainfall predicted",
                  location: cityWeather.city.name,
                });
              }
              const strongWind = cityWeather.list.some(
                (w) => w.wind && w.wind.speed > 20
              );
              if (strongWind) {
                preds.push({
                  hazard: "Storm",
                  probability: "Moderate",
                  reason: "High wind speeds predicted",
                  location: cityWeather.city.name,
                });
              }

              setCityPredictions(preds);
            });
        } else {
          setErrorMsg("Location not found. Showing only global alerts.");
          setCityPredictions([]);
        }
      })
      .catch(() => {
        setErrorMsg("Error fetching location data. Showing only global alerts.");
        setCityPredictions([]);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errorMsg}
        </div>
      )}

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold mb-6"
      >
        Disaster Prediction & Alerts
      </motion.h1>

      {/* Search Bar */}
     \

      {/* GDACS Alerts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-lg mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Latest GDACS Alerts</h2>
        <ul className="list-disc pl-5 space-y-2">
          {gdacsEvents.length ? (
            gdacsEvents.map((e, idx) => (
              <li key={idx}>
                <strong>{e.title}</strong>
                <br />
                <span className="text-sm text-gray-600">{e.description}</span>
                <br />
                <span className="text-xs text-gray-500">
                  Location: {e.location}
                </span>
              </li>
            ))
          ) : (
            <li>Loading alerts...</li>
          )}
        </ul>
      </motion.div>

      {/* Global Predictions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-yellow-50 p-6 rounded-xl shadow-lg mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4">
          Global Predicted Risks
        </h2>
        {predictions.length ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Hazard</th>
                <th className="p-2 border">Probability</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border">{p.hazard}</td>
                  <td className="p-2 border">{p.probability}</td>
                  <td className="p-2 border">{p.reason}</td>
                  <td className="p-2 border">{p.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No global risks identified.</p>
        )}
      </motion.div>

      {/* City Predictions */}
      {cityPredictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-50 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Predicted Risks for "{searchLocation}"
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Hazard</th>
                <th className="p-2 border">Probability</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {cityPredictions.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border">{p.hazard}</td>
                  <td className="p-2 border">{p.probability}</td>
                  <td className="p-2 border">{p.reason}</td>
                  <td className="p-2 border">{p.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default DisasterPredictorPage;
