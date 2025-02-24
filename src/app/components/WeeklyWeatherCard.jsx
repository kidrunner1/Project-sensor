import { useEffect, useState } from "react";
import { fetchWeather } from "@/app/serviveAPI/Weather/weatherService";

export default function WeeklyWeatherCard({ location = "Bangkok" }) {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    async function getForecast() {
      const data = await fetchWeather(location, 7);
      console.log("✅ Weekly Forecast Data:", data.forecast); // ✅ Debug API Response
      if (data && data.forecast) {
        setForecast(data.forecast);
      }
    }
    getForecast();
  }, [location]);

  return (
    <div className="flex justify-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
      {forecast.length > 0 ? (
        forecast.map((day, index) => (
          <div key={index} className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center w-24">
            <p className="text-md font-semibold text-gray-700 dark:text-gray-300">{day.dayName}</p>
            <img src={day.icon} alt="weather icon" className="w-10 h-10 mx-auto" />
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{day.tempMax}°</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{day.tempMin}°</p>
            <p className="text-xs text-blue-500 dark:text-blue-300">🌧️ {day.chanceOfRain}%</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Loading forecast...</p>
      )}
    </div>
  );
}
