import { useState, useEffect, useCallback } from "react";
import SearchForm from "./components/SearchForm";
import SearchHistory from "./components/SearchHistory";
import WeatherDisplay from "./components/WeatherDisplay";
import ErrorMessage from "./components/ErrorMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import { fetchWeatherByCity } from "./services/weatherService";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const updateSearchHistory = useCallback((cityName) => {
    setSearchHistory(prevHistory => {
      const updatedHistory = [
        cityName,
        ...prevHistory.filter((item) => item !== cityName),
      ].slice(0, 5);
      
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  // 🔹 Updated: Using useCallback to memoize the function
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.OPENWEATHER_API;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error("Could not retrieve weather for your location.");
      }
      
      const data = await response.json();
      setWeatherData(data);
      updateSearchHistory(data.name);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [updateSearchHistory]);

  const handleFetchWeather = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(cityName);
      setWeatherData(data);
      updateSearchHistory(cityName);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [updateSearchHistory]);

  // Adding the functions to the dependency array
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // fallback city if user denies or fails
          handleFetchWeather("Delhi");
        }
      );
    } else {
      handleFetchWeather("Delhi");
    }
  }, [fetchWeatherByCoords, handleFetchWeather]);

  const handleRefresh = () => {
    if (weatherData) {
      handleFetchWeather(weatherData.name);
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather Dashboard</h1>

      <SearchForm onSearch={handleFetchWeather} loading={loading} />

      <SearchHistory
        searchHistory={searchHistory}
        onHistoryClick={handleFetchWeather}
      />

      <ErrorMessage message={error} />

      {loading && <LoadingSpinner />}

      {weatherData && !loading && (
        <WeatherDisplay weatherData={weatherData} onRefresh={handleRefresh} />
      )}

      <footer className="app-footer">
        <p>Data provided by OpenWeatherMap</p>
      </footer>
    </div>
  );
}

export default App;