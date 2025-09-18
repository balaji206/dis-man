import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const HazardForecast = () => {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchHazards = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "https://api.rss2json.com/v1/api.json?rss_url=https://www.gdacs.org/xml/rss.xml"
        );

        const items = response.data.items.slice(0, 5);
        const parsedHazards = items.map((item) => ({
          title: item.title,
          link: item.link,
          date: new Date(item.pubDate).toLocaleDateString(),
          description: item.description,
          // Simulate severity from title length or random (since RSS lacks severity)
          severity: Math.floor(Math.random() * 100),
        }));

        setHazards(parsedHazards);
      } catch (err) {
        console.error("Error fetching GDACS hazards:", err);
        setError("Failed to load hazard forecasts.");
      } finally {
        setLoading(false);
      }
    };

    fetchHazards();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) return <p>Loading hazard forecasts...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const visibleHazards = showAll ? hazards : hazards.slice(0, 1);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Upcoming Hazards (GDACS)</h3>
      <ul className="space-y-3">
        {visibleHazards.map((hazard, index) => (
          <li key={index} className="border-b pb-2">
            <a
              href={hazard.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline"
            >
              {hazard.title}
            </a>
            <p className="text-sm text-gray-600">{hazard.date}</p>
            <p className="text-gray-700 text-sm">
              {expandedIndex === index
                ? hazard.description
                : `${hazard.description.slice(0, 120)}...`}
            </p>
            <button
              onClick={() => toggleExpand(index)}
              className="text-blue-500 text-sm hover:underline mt-1"
            >
              {expandedIndex === index ? "Read Less" : "Read More"}
            </button>
          </li>
        ))}
      </ul>

      {hazards.length > 1 && (
        <div className="mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {showAll ? "Show Less" : `Show More (${hazards.length - 1} more)`}
          </button>
        </div>
      )}

      {/* ✅ Graph appears only when showAll is true */}
      {showAll && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
          <h4 className="text-md font-bold mb-4 text-gray-800">
            Hazard Severity Comparison
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hazards}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="severity" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HazardForecast;
