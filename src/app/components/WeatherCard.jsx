import { useEffect, useState } from "react";
import { fetchWeather } from "@/app/serviveAPI/Weather/weatherService";

export default function WeatherCard({ location = "Bangkok" }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function getWeather() {
      const data = await fetchWeather(location, 7);
      if (data) {
        setWeather(data.current);
      }
    }
    getWeather();
  }, [location]);

  return (
    <div className="relative w-64 p-6 text-white rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* 🔹 สร้าง Layer พื้นหลังเบลอ */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-xl opacity-60"
        style={{ backgroundImage: "url('/images/bg-login.png')" }}
      />

      {/* 🔹 เนื้อหาหลัก (อยู่ด้านบนพื้นหลัง) */}
      <div className="relative z-10">
        {weather ? (
          <>
            <h2 className="text-lg font-semibold">{location}</h2>
            <p className="text-sm opacity-75">{weather.time}</p>

            <div className="flex items-center justify-between mt-4">
              <img src={weather.icon} alt="Weather Icon" className="w-16 h-16" />
              <div className="text-4xl font-bold">{weather.temperature}°C</div>
            </div>

            <p className="text-md">{weather.condition}</p>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div>
                <p className="text-lg">💧</p>
                <p className="text-sm">{weather.humidity}%</p>
              </div>
              <div>
                <p className="text-lg">💨</p>
                <p className="text-sm">{weather.wind} km/h</p>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
