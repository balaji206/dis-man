import axios from "axios";

export async function getWeather(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await axios.get(url);
  return {
    city: res.data.name,
    condition: res.data.weather[0].description,
    temp: res.data.main.temp,
    humidity: res.data.main.humidity,
    rain: res.data.rain ? res.data.rain["1h"] : 0,
  };
}
