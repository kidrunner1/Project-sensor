"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/app/serviveAPI/Weather/weatherService";
import { useAuth } from "@/app/context/AuthContext"; // ✅ ใช้ Context API

// ✅ Lazy Load Components
const WeatherCard = lazy(() => import("../../components/WeatherCard"));
const WeeklyWeatherCard = lazy(() => import("../../components/WeeklyWeatherCard"));
const TempChart = lazy(() => import("../../components/TempChart"));
const AttendanceChart = lazy(() => import("../../components/AttendanceChart"));
const LineChartCH2O = lazy(() => import("../../components/LineChartCH2O"));
const PieChartCH2O = lazy(() => import("../../components/PieChartCH2O"));
const LineChartOzone = lazy(() => import("../../components/LineChartOzone"));

const mockWeeklyWeather = [
  { dayName: "Sun", icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png", tempMax: 34, tempMin: 25, chanceOfRain: 10 },
  { dayName: "Mon", icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png", tempMax: 32, tempMin: 24, chanceOfRain: 20 },
  { dayName: "Tue", icon: "https://cdn.weatherapi.com/weather/64x64/day/308.png", tempMax: 30, tempMin: 23, chanceOfRain: 80 },
  { dayName: "Wed", icon: "https://cdn.weatherapi.com/weather/64x64/day/296.png", tempMax: 29, tempMin: 22, chanceOfRain: 50 },
  { dayName: "Thu", icon: "https://cdn.weatherapi.com/weather/64x64/day/119.png", tempMax: 31, tempMin: 23, chanceOfRain: 30 },
  { dayName: "Fri", icon: "https://cdn.weatherapi.com/weather/64x64/night/113.png", tempMax: 28, tempMin: 21, chanceOfRain: 10 },
  { dayName: "Sat", icon: "https://cdn.weatherapi.com/weather/64x64/day/176.png", tempMax: 27, tempMin: 20, chanceOfRain: 40 },
];

const HomePageTest = () => {
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ ใช้ React Query โหลดข้อมูล
  const { data, isLoading } = useQuery({
    queryKey: ["weather", "Bangkok"],
    queryFn: () => fetchWeather("Bangkok", 7),
    staleTime: 1000 * 60 * 10,
    retry: 3,
  });

  // ✅ ถ้า API ใช้ไม่ได้ ให้ใช้ Mock Data
  const weatherData = data?.current || {
    temperature: 30,
    humidity: 50,
    wind: 10,
    condition: "Unknown",
    icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png",
  };
  const forecast = data?.forecast || mockWeeklyWeather;

  if (!isMounted) {
    return <FullPageSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        🔄 กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6 h-screen overflow-hidden overflow-y-auto">
      {/* ✅ Charts Section (Responsive Grid) */}
        <h2 className="text-3xl font-bold  md:text-left">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* ✅ Temperature Chart */}
        <div className="min-h-[300px] h-auto w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Suspense fallback={<SkeletonChart />}>
            {isLoading ? <SkeletonChart /> : <TempChart location="Bangkok" />}
          </Suspense>
        </div>

        {/* ✅ Attendance Chart */}
        <div className="min-h-[300px] h-auto w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Suspense fallback={<SkeletonChart />}>
            {isLoading ? <SkeletonChart /> : <AttendanceChart />}
          </Suspense>
        </div>
      </div>

      {/* ✅ Pollution Charts Section */}
      <div className="grid  gap-4 w-full">
        {/* ✅ Ozone Chart */}
        <div className="min-h-[500px] h-auto w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          
          <Suspense fallback={<SkeletonChart />}>
            {isLoading ? <SkeletonChart /> : <LineChartOzone />}
          </Suspense>
        </div>

        {/* ✅ Formaldehyde Chart */}
        <div className="min-h-[500px] h-auto w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          
          <Suspense fallback={<SkeletonChart />}>
            {isLoading ? <SkeletonChart /> : <LineChartCH2O />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// ✅ Skeleton UI - แสดงระหว่างโหลดข้อมูล
const Skeleton = () => <div className="animate-pulse bg-gray-700 h-10 w-full rounded-md"></div>;
const SkeletonChart = () => <div className="animate-pulse bg-gray-700 h-full w-full rounded-md"></div>;

// ✅ Skeleton UI สำหรับ Full Page
const FullPageSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    <Skeleton />
    <Skeleton />
    <SkeletonChart />
    <SkeletonChart />
  </div>
);

export default HomePageTest;
