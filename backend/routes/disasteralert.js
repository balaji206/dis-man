// routes/disasterAlert.js
import express from "express";
import sendTelegramMessage from "../utils/telegram.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { lat, lon } = req.body;
  if (!lat || !lon) return res.status(400).json({ status: "❌ Coordinates missing" });

  try {
    const message = `🚨 Disaster Alert!\nUser location: Lat ${lat}, Lon ${lon}`;
    await sendTelegramMessage(message);
    return res.json({ status: "✅ Alert sent via Telegram" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "❌ Failed to send alert" });
  }
});

export default router;
