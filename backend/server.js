
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

import newsRoute from "./routes/news.js";
import weatherRoute from "./routes/weather.js";
import disastersRoute from "./routes/disasters.js";
import riskRoute from "./routes/risk.js";
import authRoute from "./routes/auth.js";
import assistantRoute from "./routes/assistant.js"; // 👈 new smart assistant
import hazardReportsRoute from "./routes/hazardroutes.js";
import checklistRoute from "./routes/checklist.js";
import earthquakeRoute from "./routes/earthquake.js";
import sendWhatsAppMessage from "./utils/twilio.js";
import floodRoute from "./routes/flood.js";
import sendTelegramMessage from "./utils/telegram.js";
import disasterAlertRoute from "./routes/disasteralert.js";
dotenv.config();

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// ✅ Register routes
app.use("/api/assistant", assistantRoute);
app.use("/api/weather", weatherRoute);
app.use("/api/news", newsRoute);
app.use("/api/disasters", disastersRoute);
app.use("/api/risk", riskRoute);
app.use("/api/auth", authRoute);
app.use("/api/earthquakes", earthquakeRoute);
app.use("/api/checklist", checklistRoute);
app.use("/api/flood", floodRoute);  
app.use("/api/disaster-alert", disasterAlertRoute);
// Create HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigin, methods: ["GET", "POST"] },
});


// Track earthquake users
const earthquakeUsers = new Map(); // socket.id => { socket, lat, lon, alertedIds: Set }
const sentWhatsAppIds = new Set(); // avoid duplicate WA alerts

// ✅ Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  // Store earthquake location if passed
  const { lat, lon } = socket.handshake.query;
  if (lat && lon) {
    earthquakeUsers.set(socket.id, {
      socket,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      alertedIds: new Set(),
    });
  }
  
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    earthquakeUsers.delete(socket.id);
  });
});

app.use("/api/hazard-reports", hazardReportsRoute(io));
// ================== EXISTING RISK ALERTS ==================
const riskLevels = ["Low", "Moderate", "High", "Severe"];
setInterval(() => {
  const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
  const alertMessage =
    randomRisk === "High" || randomRisk === "Severe"
      ? `🚨 ${randomRisk} Risk detected! Stay alert.`
      : `✅ ${randomRisk} Risk. Situation under control.`;

  // Emit alert to all connected clients
  io.emit("alert", {
    type: randomRisk === "High" || randomRisk === "Severe" ? "critical" : "info",
    message: alertMessage,
  });

  // Send WhatsApp only for critical alerts
  if (randomRisk === "High" || randomRisk === "Severe") {
    const demoUserNumber = process.env.DEMO_USER_WHATSAPP;
    if (demoUserNumber) sendWhatsAppMessage(demoUserNumber, alertMessage);
  }
}, 15000);

// ================== EARTHQUAKE ALERTS ==================
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function checkEarthquakes() {
  try {
    const response = await axios.get(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
    );
    const earthquakes = response.data.features;

    earthquakeUsers.forEach((user) => {
      const { socket, lat, lon, alertedIds } = user;

      const newNearby = earthquakes
        .map((eq) => {
          const [eqLon, eqLat] = eq.geometry.coordinates;
          const distance = getDistance(lat, lon, eqLat, eqLon);
          return {
            id: eq.id,
            place: eq.properties.place,
            mag: eq.properties.mag,
            distance: distance.toFixed(2),
          };
        })
        .filter(
          (eq) =>
            eq.distance <= 100 && eq.mag >= 4 && !alertedIds.has(eq.id)
        );

      if (newNearby.length > 0) {
  // Socket alert
  socket.emit(
    "earthquake-alert",
    newNearby.map((eq) => ({
      ...eq,
      msg: `Earthquake Alert! ${eq.place}, Magnitude: ${eq.mag}, Distance: ${eq.distance} km`,
    }))
  );

  // WhatsApp + Telegram
  newNearby.forEach(async (eq) => {
    const alertMsg = `🌍 Earthquake Alert!\n${eq.place}\nMagnitude: ${eq.mag}\nDistance: ${eq.distance} km`;

    // WhatsApp
    if (!sentWhatsAppIds.has(eq.id)) {
      const demoUserNumber = process.env.DEMO_USER_WHATSAPP;
      if (demoUserNumber) await sendWhatsAppMessage(demoUserNumber, alertMsg);
      sentWhatsAppIds.add(eq.id);
    }

    // Telegram
    await sendTelegramMessage(alertMsg);

    alertedIds.add(eq.id);
  });
}

    });
  } catch (err) {
    console.error("Error fetching earthquakes:", err.message);
  }
}

// Poll every 5 min
setInterval(checkEarthquakes, 5 * 60 * 1000);

// ================== START SERVER ==================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
