import { useEffect, useState } from "react";

// ✅ Mock Data: สร้างข้อมูลจำลองแทน API
const mockWeeklyWeather = [
  { dayName: "Sun", icon: "http://cdn.weatherapi.com/weather/64x64/day/113.png", tempMax: 34, tempMin: 25, chanceOfRain: 10 },
  { dayName: "Mon", icon: "http://cdn.weatherapi.com/weather/64x64/day/116.png", tempMax: 32, tempMin: 24, chanceOfRain: 20 },
  { dayName: "Tue", icon: "http://cdn.weatherapi.com/weather/64x64/day/308.png", tempMax: 30, tempMin: 23, chanceOfRain: 80 },
  { dayName: "Wed", icon: "http://cdn.weatherapi.com/weather/64x64/day/296.png", tempMax: 29, tempMin: 22, chanceOfRain: 50 },
  { dayName: "Thu", icon: "http://cdn.weatherapi.com/weather/64x64/day/119.png", tempMax: 31, tempMin: 23, chanceOfRain: 30 },
  { dayName: "Fri", icon: "http://cdn.weatherapi.com/weather/64x64/night/113.png", tempMax: 28, tempMin: 21, chanceOfRain: 10 },
  { dayName: "Sat", icon: "http://cdn.weatherapi.com/weather/64x64/day/176.png", tempMax: 27, tempMin: 20, chanceOfRain: 40 },
];

export default function WeeklyWeatherCard() {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    // ✅ ใช้ Mock Data แทน API
    setForecast(mockWeeklyWeather);
  }, []);

  return (
    <div className="w-full h-full p-4 ">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {forecast.length > 0 ? (
          forecast.map((day, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center w-20 sm:w-24"
            >
              <p className="text-md font-semibold text-gray-700 dark:text-gray-300">{day.dayName}</p>
              <img src={day.icon} alt="weather icon" className="w-12 h-12 mx-auto" />
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{day.tempMax}°</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{day.tempMin}°</p>
              <p className="text-xs text-blue-500 dark:text-blue-300">🌧️ {day.chanceOfRain}%</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Loading forecast...</p>
        )}
      </div>
    </div>
  );
}
