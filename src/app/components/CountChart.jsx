"use client";

import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { fetchWeather } from "../weatherService";  // Make sure this function handles errors properly

const CountChart = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherData = async () => {
      setLoading(true);
      try {
        const data = await fetchWeather("Bangkok"); // Assuming this is your API call
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, []);

  const chartData = weatherData
    ? [
      { name: "Total", count: 100, fill: "#f0f0f0" }, // สีเทาอ่อนสำหรับ Total
      { name: "อุณหภูมิ", count: weatherData.temperature, fill: "#FF6347" }, // สีส้ม (Tomato) สำหรับอุณหภูมิ
      { name: "ความเร็วลม", count: weatherData.wind, fill: "#FFD700" }, // สีทองสำหรับความเร็วลม
      { name: "ความชื้น", count: weatherData.humidity, fill: "#20B2AA" }, // สีเขียวอ่อน (LightSeaGreen) สำหรับความชื้น
    ]
    : [];


  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between ">
        <h1 className="text-lg font-semibold">สภาพอากาศ</h1>
        <Image src="/images/more.png" alt="" width={25} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        {loading ? (
          <p className="text-center mt-4">Loading...</p> // You can replace this with a spinner for better UX
        ) : (
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={32}
              data={chartData}
            >
              <RadialBar label={{ position: "insideStart", fill: "#fff" }} background dataKey="count" />
            </RadialBarChart>
          </ResponsiveContainer>
        )}
        <Image
          src="/images/temp.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        {weatherData && (
          <>
            <div className="flex flex-col gap-1">
              <div className="w-5 h-5 bg-lamaOrangeDark rounded-full" />
              <h1 className="font-bold">{weatherData.temperature}</h1>
              <h2 className="text-sm text-zinc-500">อุณหภูมิ</h2>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-5 h-5 bg-lamaYellowLight rounded-full" />
              <h1 className="font-bold">{weatherData.wind}</h1>
              <h2 className="text-sm text-zinc-500">ความเร็วลม</h2>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-5 h-5 bg-lamaGreenLightPale rounded-full" />
              <h1 className="font-bold">{weatherData.humidity}</h1>
              <h2 className="text-sm text-zinc-500">ความชื้น</h2>
            </div>
          </>
        )}
        {/* คำแนะนำเพิ่มเติมหรือข้อความที่สำคัญ */}
      </div>

    </div>
  );
};

export default CountChart;
