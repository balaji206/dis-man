// Weather.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Wind, Droplet } from 'lucide-react';

function Weather() {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aqi, setAqi] = useState(null);

  const fetchAQI = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=45bbb0cdd496b43fb8ea4c5d5be103c6&units=metric`
      );
      const data = await response.json();
      const aqiIndex = data.list[0].main.aqi;

      const aqiMap = {
        1: { label: 'Good', value: 50, color: 'bg-green-200 text-green-800' },
        2: { label: 'Fair', value: 100, color: 'bg-yellow-200 text-yellow-800' },
        3: { label: 'Moderate', value: 150, color: 'bg-orange-200 text-orange-800' },
        4: { label: 'Poor', value: 200, color: 'bg-red-200 text-red-800' },
        5: { label: 'Very Poor', value: 300, color: 'bg-purple-200 text-purple-800' }
      };

      setAqi(aqiMap[aqiIndex]);
    } catch (error) {
      console.error('Failed to fetch AQI:', error);
    }
  };

  const getWeather = useCallback(async (cityName) => {
    if (!cityName.trim()) {
      setWeather(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=45bbb0cdd496b43fb8ea4c5d5be103c6&units=metric`
      );

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'City not found' : 'Failed to fetch weather data');
      }

      const data = await response.json();
      setWeather(data);
      const { lat, lon } = data.coord;
      fetchAQI(lat, lon);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        getWeather(search);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, getWeather]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 to-indigo-500 p-6 flex justify-center items-center">
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          ← Back
        </Link>
      </div>

      <div className="max-w-lg w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 space-y-6 animate-fade-in">
        <div className="relative">
          <input
            className="w-full px-6 py-4 rounded-xl bg-gray-100 shadow-inner text-lg focus:ring-4 focus:ring-blue-400 focus:outline-none transition-all"
            type="search"
            placeholder="🔍 Search for a city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {aqi && !loading && weather && (
          <div className="text-center">
            <img src="air-quality.png" alt="AQI" className="w-20 mx-auto mb-3 animate-fade-in" />
            <div className={`inline-block px-5 py-2 rounded-full font-semibold text-sm ${aqi.color} shadow`}>
              AQI: {aqi.value} – {aqi.label}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {weather && !loading && !error && (
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{weather.name}</h2>
                <p className="text-5xl font-extrabold text-blue-700 mt-1">{Math.round(weather.main.temp)}°C</p>
              </div>
              {weather.weather[0] && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt={weather.weather[0].description}
                  className="w-24 h-24 drop-shadow"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg flex items-center gap-3 shadow-sm">
                <Droplet className="w-7 h-7 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-xl font-semibold text-gray-800">{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg flex items-center gap-3 shadow-sm">
                <Wind className="w-7 h-7 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Wind Speed</p>
                  <p className="text-xl font-semibold text-gray-800">{weather.wind.speed} km/h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!search && !weather && !loading && !error && (
          <div className="text-center text-gray-600 py-10">
            <p className="text-lg">Start typing a city name to view weather updates 🌤️</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
