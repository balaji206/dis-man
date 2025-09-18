// /routes/flood.js
import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/flood?lat=13.08&lon=80.27
router.get("/", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    // Call Open-Meteo Flood API
    const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=river_discharge,return_period_5y,return_period_20y&timezone=auto`;

    const response = await axios.get(url);

    const floodData = response.data.daily;
    const todayIndex = 0; // latest day
    const discharge = floodData.river_discharge[todayIndex];
    const risk5y = floodData.return_period_5y[todayIndex];
    const risk20y = floodData.return_period_20y[todayIndex];

    let riskMessage = "✅ No flood risk detected.";
    if (risk5y) riskMessage = "⚠️ 5-year flood risk detected!";
    if (risk20y) riskMessage = "🚨 20-year flood risk detected!";

    res.json({
      location: { lat, lon },
      river_discharge: discharge,
      risk: riskMessage
    });
  } catch (err) {
    console.error("❌ Flood API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch flood data" });
  }
});

export default router;
