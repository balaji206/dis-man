import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsFeed = () => {
  const [latestNews, setLatestNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "https://api.reliefweb.int/v1/disasters?appname=disaster-dashboard&profile=full&limit=1&sort[]=date:desc"
        );

        const item = response.data.data[0].fields;

        const disaster = {
          name: item.name,
          date: item.date?.created || "N/A",
          country: item.country?.map((c) => c.name).join(", ") || "Global",
          description: item.description || "No description available",
        };

        setLatestNews(disaster);
      } catch (err) {
        console.error("Error fetching disasters:", err);
        setError("Failed to load disaster news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading latest disaster...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const getPreviewText = (text, limit = 200) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div>
      {latestNews ? (
        <div className="border rounded-lg p-4 bg-gray-50 shadow">
          <strong className="block text-blue-600 text-lg">{latestNews.name}</strong>
          <span className="block text-gray-600 text-sm mb-2">
            {latestNews.country} — {new Date(latestNews.date).toLocaleDateString()}
          </span>
          <p className="text-gray-700 text-sm">
            {expanded
              ? latestNews.description
              : getPreviewText(latestNews.description)}
          </p>
          {latestNews.description.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 mt-2 hover:underline text-sm font-semibold"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      ) : (
        <p>No disaster updates available.</p>
      )}
    </div>
  );
};

export default NewsFeed;
