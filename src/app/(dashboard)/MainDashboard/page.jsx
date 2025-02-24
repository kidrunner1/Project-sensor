"use client";

import React, { useEffect, useState } from "react";
import AttendanceChart from "../../components/AttendanceChart";
import CountChart from "../../components/CountChart";
import BottomChart from "../../components/BottomChart";
import WeatherCard from "@/app/components/WeatherCard"; // ✅ แก้ Path
import WeeklyWeatherCard from "@/app/components/WeeklyWeatherCard"; // ✅ แก้ชื่อ Component
import { useRouter } from "next/navigation";
import { fetchWeather } from "@/app/serviveAPI/Weather/weatherService"; // ✅ แก้ Path

const HomePageTest = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); // ✅ เพิ่ม State สำหรับพยากรณ์อากาศ

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (!accessToken) {
      console.warn("🔴 No access token found, redirecting to login...");
      logoutUser();
      return;
    }

    if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
      console.warn("🔴 Token expired, logging out...");
      logoutUser();
      return;
    }

    setIsAuthenticated(true);

    // ✅ ดึงข้อมูลสภาพอากาศและพยากรณ์อากาศ
    async function getWeather() {
      const data = await fetchWeather("Bangkok", 7);
      console.log("✅ Weather Data:", data); // ✅ Debug API Response
      if (data) {
        setWeather(data.current);
        setForecast(data.forecast);
      }
    }
    console.log("✅ Forecast Data in HomePageTest:", forecast);

    getWeather();
  }, []);

  const logoutUser = () => {
    localStorage.clear();
    router.push("/");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        🔄 กำลังโหลด...
      </div>
    );
  }


  return (
    <div className="flex h-screen">

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col overflow-auto h-screen p-4">
        <div className="w-full flex flex-col gap-8">

          {/* ✅ Section: Weather Information (WeatherCard + WeeklyWeatherCard in Row) */}
          <div className="w-full flex flex-row gap-4 items-start">
            {/* ✅ Weather Card (Fixed Width) */}
            <div className="w-64 ">
              {weather ? <WeatherCard weather={weather} /> : <p className="text-white">Loading weather...</p>}
            </div>

            {/* ✅ Weekly Weather Forecast (Expandable) */}
            <div className="w-full flex flex-row gap-4 items-start  ">
              {/* <h2 className="text-2xl font-bold my-4">🌤️ 7-Day Weather Forecast</h2> */}
              {forecast.length > 0 ? <WeeklyWeatherCard forecast={forecast} /> : <p>Loading forecast...</p>}
            </div>
          </div>

          {/* ✅ CHARTS */}
          {/* <div className="flex gap-4 flex-col lg:flex-row">
            <div className="w-full h-[450px]">
              <CountChart />
            </div>
          </div>

          <div className="w-full h-[550px]">
            <AttendanceChart />
          </div>

          <div className="flex w-full h-[500px] mt-5">
            <BottomChart />
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default HomePageTest;
