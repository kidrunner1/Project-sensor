"use client";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchWeather } from "../weatherService";

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CountChart = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherData = async () => {
      setLoading(true);
      const data = await fetchWeather("Bangkok"); // เรียกฟังก์ชัน fetchWeather
      setWeatherData(data);
      setLoading(false);
    };

    getWeatherData();
  }, []);

  const chartData = weatherData
    ? [
        { name: "Total", count: 100, fill: "white" },
        { name: "อุณหภูมิ", count: weatherData.temperature, fill: "#B0E0E6" },
        { name: "ความเร็วลม", count: weatherData.wind, fill: "#FFA07A" },
        { name: "ความชื้น", count: weatherData.humidity, fill: "#90EE90" },
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
          <p className="text-center mt-4">Loading...</p>
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
              <RadialBar
                label={{ position: "insideStart", fill: "#fff" }}
                background
                dataKey="count"
              />
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
              <div className="w-5 h-5 bg-lamaSky rounded-full" />
              <h1 className="font-bold">{weatherData.temperature}</h1>
              <h2 className="text-sm text-zinc-500">อุณหภูมิ</h2>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-5 h-5 bg-lamaRedLight rounded-full" />
              <h1 className="font-bold">{weatherData.wind}</h1>
              <h2 className="text-sm text-zinc-500">ความเร็วลม</h2>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-5 h-5 bg-lamaGreenLight rounded-full" />
              <h1 className="font-bold">{weatherData.humidity}</h1>
              <h2 className="text-sm text-zinc-500">ความชื้น</h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CountChart;
