import express from "express";
import sendTelegramMessage  from "../utils/telegram.js";

const router = express.Router();

// Example: areas & dummy alerts logic
const areas = [{ name: "Chennai", lat: 13.0827, lon: 80.2707 }];

function getDummyAlerts(lat, lon) {
  const alerts = [];
  // Example: send alert if near Chennai
  if (Math.abs(lat - 13.0827) < 0.5 && Math.abs(lon - 80.27) < 0.5) {
    alerts.push("⚠️ Flood risk in Chennai!");
  }
  return alerts;
}

router.post("/", async (req, res) => {
  const { lat, lon } = req.body;
  if (!lat || !lon) return res.status(400).json({ error: "Missing coordinates" });

  const alerts = getDummyAlerts(lat, lon);

  try {
    if (alerts.length > 0) {
      const alertText = `Disaster Alerts:\n${alerts.join("\n")}`;
      await sendTelegramMessage(alertText); // Telegram send
      return res.json({ status: "Alert sent via Telegram", alerts });
    } else {
      return res.json({ status: "No alerts at this time", alerts });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send Telegram alert" });
  }
});

export default router;
