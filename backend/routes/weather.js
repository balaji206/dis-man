import express from "express";
import axios from "axios";

const router = express.Router();

// Mock Data
const mockWeather = {
  temp: 30,
  condition: "Clear",
  humidity: 60
};

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_KEY;

  if (!apiKey) {
    return res.json(mockWeather);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;

    res.json({
      temp: data.main.temp,
      condition: data.weather[0].main,
      humidity: data.main.humidity
    });
  } catch (error) {
    console.error(error);
    res.json(mockWeather);
  }
});

export default router;
