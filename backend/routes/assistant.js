import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Helper: check if message contains any keyword
function includesAny(text, keywords) {
  return keywords.some(k => text.includes(k));
}

// Haversine formula to calculate distance (used for earthquakes)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: "Messages array is required" });

    const userMessage = messages[messages.length - 1].content.toLowerCase();

    // Use default coordinates if not provided
    const defaultLat = 13.0827; // Chennai
    const defaultLon = 80.2707;

    // --- Weather ---
    if (includesAny(userMessage, ["weather", "temperature", "rain"])) {
      try {
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${defaultLat}&lon=${defaultLon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
        );
        const { temp, humidity } = weatherRes.data.main;
        const condition = weatherRes.data.weather[0].description;

        return res.json({
          choices: [
            {
              message: {
                role: "assistant",
                content: `🌤️ Current weather in Chennai: ${temp}°C, ${condition}. Humidity: ${humidity}%.`,
              },
            },
          ],
        });
      } catch {
        return res.json({
          choices: [
            {
              message: {
                role: "assistant",
                content: "⚠️ Couldn't fetch weather data for Chennai.",
              },
            },
          ],
        });
      }
    }

    // --- Earthquake ---
    if (includesAny(userMessage, ["earthquake", "quake", "richter"])) {
      try {
        const eqRes = await axios.get(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
        );
        const earthquakes = eqRes.data.features;

        const nearby = earthquakes
          .map(eq => {
            const [eqLon, eqLat] = eq.geometry.coordinates;
            const distance = getDistance(defaultLat, defaultLon, eqLat, eqLon);
            return {
              place: eq.properties.place,
              mag: eq.properties.mag,
              distance: distance.toFixed(2),
            };
          })
          .filter(eq => eq.distance <= 100 && eq.mag >= 4);

        if (nearby.length === 0) {
          return res.json({
            choices: [
              { message: { role: "assistant", content: "✅ No recent earthquakes near Chennai." } },
            ],
          });
        }

        const reply = nearby
          .map(q => `🌍 ${q.place}, Magnitude: ${q.mag}, Distance: ${q.distance} km`)
          .join("\n");

        return res.json({ choices: [{ message: { role: "assistant", content: `Recent earthquakes:\n${reply}` } }] });
      } catch {
        return res.json({
          choices: [{ message: { role: "assistant", content: "⚠️ Couldn't fetch earthquake data." } }],
        });
      }
    }

    // --- Flood ---
    if (includesAny(userMessage, ["flood", "cyclone", "storm", "disaster"])) {
      try {
        const floodRes = await axios.get(
          `https://flood-api.open-meteo.com/v1/flood?latitude=${defaultLat}&longitude=${defaultLon}&daily=river_discharge,return_period_5y,return_period_20y&timezone=auto`
        );

        const floodData = floodRes.data.daily;
        const todayIndex = 0;
        const discharge = floodData.river_discharge[todayIndex];
        const risk5y = floodData.return_period_5y[todayIndex];
        const risk20y = floodData.return_period_20y[todayIndex];

        let riskMessage = "✅ No flood risk detected.";
        if (risk5y) riskMessage = "⚠️ 5-year flood risk detected!";
        if (risk20y) riskMessage = "🚨 20-year flood risk detected!";

        return res.json({
          choices: [
            {
              message: {
                role: "assistant",
                content: `🌊 Flood info in Chennai:\nRiver Discharge: ${discharge}\nRisk Level: ${riskMessage}`,
              },
            },
          ],
        });
      } catch {
        return res.json({
          choices: [{ message: { role: "assistant", content: "⚠️ Couldn't fetch flood data." } }],
        });
      }
    }

    // --- Default: Forward to AI ---
    const aiRes = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { model: "openai/gpt-4o-mini", messages },
      { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" } }
    );

    res.json(aiRes.data);
  } catch (error) {
    console.error("❌ Assistant API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

export default router;
