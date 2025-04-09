import { useState} from "react";
import SearchForm from "./components/SearchForm";
import SearchHistory from "./components/SearchHistory";
import WeatherDisplay from "./components/WeatherDisplay";
import ErrorMessage from "./components/ErrorMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import { fetchWeatherByCity } from "./services/weatherService";
import "./App.css";

function App() {
  // State management
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Function to fetch weather data
  const handleFetchWeather = async (cityName) => {
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
  };

  // Update search history
  const updateSearchHistory = (cityName) => {
    const updatedHistory = [
      cityName,
      ...searchHistory.filter((item) => item !== cityName),
    ].slice(0, 5);

    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // Handle refresh
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
