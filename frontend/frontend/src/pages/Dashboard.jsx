import React, { useState, useEffect, useMemo } from "react";
import MapView from "../components/Mapveiw";
import WeatherWidget from "../components/WeatherWidget";
import RiskAlert from "../components/RiskAlert";
import NewsFeed from "../components/NewsFeed";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import HazardForecast from "../components/hazard";
import { useTranslation } from "react-i18next";
import "../i18n";
import WeatherMap from "../data/weathermap";
import EmergencyContacts from "../components/emergencycontacts";
import PreparednessChecklist from "../components/preparationchecklist";
import guardiaIcon from "../assets/girl.png";
import CollectorAlerts from "./collectoralerts";

const Dashboard = () => {
  const [location, setLocation] = useState({ lat: 13.0827, lng: 80.2707 });
  const [weather, setWeather] = useState({});
  const [risk, setRisk] = useState("Low");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);

  const { t, i18n } = useTranslation();
  const alerts = t("alerts_list", { returnObjects: true }) || [];

  const calculateRisk = (weatherData) => {
    let score = 0;
    if (weatherData.temp > 35) score += 30;
    if (weatherData.humidity > 80) score += 20;
    if (["Storm", "Cyclone", "Flood", "Rain"].includes(weatherData.condition))
      score += 40;

    if (score >= 70) return "High";
    if (score >= 40) return "Medium";
    return "Low";
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const weatherRes = await axios.get(
        `http://localhost:5000/api/weather?lat=${location.lat}&lon=${location.lng}`
      );
      setWeather(weatherRes.data);

      try {
        const riskRes = await axios.get(
          `http://localhost:5000/api/risk?temp=${weatherRes.data.temp}&humidity=${weatherRes.data.humidity}&condition=${weatherRes.data.condition}`
        );
        setRisk(riskRes.data.riskScore);
      } catch {
        setRisk(calculateRisk(weatherRes.data));
      }

      const disasterRes = await axios.get(
        `https://api.reliefweb.int/v1/disasters?appname=your-app&profile=full&limit=10`
      );

      const liveDisasters = (disasterRes.data?.data || []).map((item) => ({
        id: item.id,
        title: item.fields?.name || "Unknown Disaster",
        date: item.fields?.date?.created || "N/A",
        description: item.fields?.description || "No description available",
        country:
          item.fields?.country?.map((c) => c.name).join(", ") || "Global",
        lat: item.fields?.geo?.lat ?? null,
        lng: item.fields?.geo?.lon ?? null,
      }));

      setNews(liveDisasters);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    const handler = (data) => {
      const id = Date.now();
      const translated = data.key
        ? t(data.key)
        : t(data.message) !== data.message
        ? t(data.message)
        : data.message;

      setNotifications((prev) => [
        ...prev,
        { ...data, id, message: translated },
      ]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    };

    socket.on("alert", handler);
    return () => {
      socket.off("alert", handler);
      socket.disconnect();
    };
  }, [i18n.language, t]);

  const ndmaCards = useMemo(
    () => [
      {
        name: "🌍 Earthquake",
        link: "https://ndma.gov.in/index.php/Resources/awareness/earthquake",
        tips: "Drop, Cover, Hold. Avoid elevators. Stay indoors if safe.",
      },
      {
        name: "🌊 Flood",
        link: "https://ndma.gov.in/Resources/awareness/flood",
        tips: "Move to higher ground. Avoid walking or driving through water.",
      },
      {
        name: "🌀 Cyclone",
        link: "https://ndma.gov.in/index.php/Resources/awareness/cyclone",
        tips: "Stay indoors. Secure loose items. Follow IMD warnings.",
      },
      {
        name: "☀️ Heatwave",
        link: "https://ndma.gov.in/Resources/awareness/heatwave",
        tips: "Stay hydrated. Avoid 12–4 PM outdoors. Wear light clothes.",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-50 bg-white shadow-sm rounded-lg p-4 flex flex-wrap justify-between items-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-blue-600">{t("Dashboard")}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="ta">TA</option>
          </select>
          <span className="text-sm text-gray-600">
            {t("last_updated")}:{" "}
            <strong>{lastUpdated || "..."}</strong>
          </span>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
          >
            {t("refresh")}
          </button>
          <Link
            to="/check-wether"
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
          >
            {t("check_weather")}
          </Link>
          <Link
            to="/"
            className="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800"
          >
            {t("home")}
          </Link>
          <Link
            to="/gov-data"
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700"
          >
            {t("Government Data")}
          </Link>
          <button
  onClick={() => window.location.href = "tel:101"} // direct SOS call
  className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700"
>
  🚨 SOS
</button>

        </div>
      </motion.div>

      {/* Notifications */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`px-4 py-2 rounded-lg shadow-md text-white text-sm flex items-center justify-between ${
              note.type === "critical" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            <span>{note.message}</span>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== note.id)
                )
              }
              className="ml-3 text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <RiskAlert risk={risk} />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-3">{t("Weather Map")}</h2>
            <WeatherMap lat={location.lat} lng={location.lng} zoom={6} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <PreparednessChecklist risk={risk} />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-3">{t("Current Weather")}</h2>
            <WeatherWidget weather={weather} />
          </div>

          <EmergencyContacts />

          <div className="bg-white rounded-lg shadow-md p-6">
    <CollectorAlerts />
  </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">{t("Some Tips")}</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
              {(Array.isArray(alerts) ? alerts : []).map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Full width sections */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-3">{t("Previous Disaster News")}</h2>
        <NewsFeed
          news={news}
          expanded={expandedSection === "news"}
          onToggle={() =>
            setExpandedSection(expandedSection === "news" ? null : "news")
          }
        />
      </div>
      {/* Emergency Section */}
<div className="bg-white rounded-lg shadow-md p-6 mt-6">
  <h2 className="text-xl font-semibold mb-4">🏥 Emergency Help</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Food */}
    <div className="p-4 border rounded-lg text-center">
      <h3 className="font-semibold mb-2">🍲 Food</h3>
      <p className="text-sm text-gray-700">
        Hot meals available nearby — assistance available immediately.
      </p>
    </div>

    {/* Shelter */}
    <div className="p-4 border rounded-lg text-center">
      <h3 className="font-semibold mb-2">🏠 Shelter</h3>
      <p className="text-sm text-gray-700">
        Temporary shelter available for up to 48 hours.
      </p>
    </div>

    {/* Accommodation */}
    <div className="p-4 border rounded-lg text-center">
      <h3 className="font-semibold mb-2">🏨 Accommodation</h3>
      <p className="text-sm text-gray-700">
        Long-term accommodation support available through local services.
      </p>
    </div>
  </div>
</div>


      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-3">{t("hazard_forecast")}</h2>
        <HazardForecast
          expanded={expandedSection === "hazard"}
          onToggle={() =>
            setExpandedSection(expandedSection === "hazard" ? null : "hazard")
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {ndmaCards.map((d, idx) => (
          <a
            key={idx}
            href={d.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">{d.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{d.tips}</p>
            <span className="text-xs text-blue-600 underline">
              {t("ndma_guidelines")}
            </span>
          </a>
        ))}
      </div>

      <div className="mt-6">
        {/* Floating AI Assistant Button (Guardia) */}
{/* Floating AI Assistant Button (Guardia) */}
<Link
  to="/assistant"
  className="fixed bottom-6 right-6 z-50 group"
>
  <div className="relative flex items-center justify-center">
    {/* Guardia Icon */}
    <img
      src={guardiaIcon}
      alt="Guardia"
      className="w-16 h-16 rounded-full shadow-lg cursor-pointer hover:scale-105 transition"
    />

    {/* Tooltip */}
    <span className="absolute right-20 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Hi, I am Guardia
    </span>
  </div>
</Link>


      </div>
    </div>
  );
};

export default Dashboard;
