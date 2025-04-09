const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeatherByCity = async (cityName) => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "City not found. Please check the spelling and try again."
        : "Failed to fetch weather data. Please try again later."
    );
  }

  return await response.json();
};
