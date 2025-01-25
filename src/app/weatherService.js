const BASE_URL = "http://api.weatherapi.com/v1/current.json?key=e8ba8aed3ae34682b7333123252301&q=Bangkok&aqi=no";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Add your API key here

export const fetchWeather = async (location) => {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${location}&aqi=no`);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    return {
      time: data.location.localtime, // Local time of the location
      temperature: data.current.temp_c, // Temperature in Celsius
      humidity: data.current.humidity, // Humidity percentage
      wind: data.current.wind_kph, // Wind speed in kph
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
