import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const GNEWS_API = process.env.GNEWS_API_KEY; // Add your GNews API key in .env

// GET /api/news?query=flood
router.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ error: "Query parameter is required" });

  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=5&token=${GNEWS_API}`
    );

    const articles = response.data.articles.map(a => ({
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source.name,
      publishedAt: a.publishedAt,
    }));

    res.json(articles);
  } catch (err) {
    console.error("❌ GNews API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
