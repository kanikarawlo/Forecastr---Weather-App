function WeatherDisplay({ weatherData, onRefresh }) {
  if (!weatherData) return null;

  return (
    <div className="weather-card">
      <div className="card-header">
        <h2>
          {weatherData.name}, {weatherData.sys.country}
        </h2>
        <button
          onClick={onRefresh}
          className="refresh-button"
          aria-label="Refresh weather data"
        >
          ↻
        </button>
      </div>

      <div className="weather-main">
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt={weatherData.weather[0].description}
          className="weather-icon"
        />
        <div className="temperature">{Math.round(weatherData.main.temp)}°C</div>
      </div>

      <div className="weather-description">
        {weatherData.weather[0].description}
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Feels like:</span>
          <span className="detail-value">
            {Math.round(weatherData.main.feels_like)}°C
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Humidity:</span>
          <span className="detail-value">{weatherData.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind:</span>
          <span className="detail-value">{weatherData.wind.speed} km/h</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure:</span>
          <span className="detail-value">{weatherData.main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;
