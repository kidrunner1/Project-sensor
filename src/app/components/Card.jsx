"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchWeather } from "../weatherService"; // ดึงข้อมูล API

const Card = ({ type, int }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // ดึงข้อมูลจาก API (ในที่นี้ใช้สถานที่ "Bangkok")
      const data = await fetchWeather("Bangkok");

      if (data) {
        setWeatherData(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const renderData = () => {
    // แสดงข้อมูลตามประเภท (type)
    switch (type) {
      case "ความชื้น":
        return weatherData ? weatherData.humidity : "Loading...";
      case "อุณหภูมิ":
        return weatherData ? weatherData.temperature : "Loading...";
      case "ความเร็วลม":
        return weatherData ? weatherData.wind : "Loading...";
      case "ทิศทางลม":
        return weatherData ? weatherData.windDirection : "Loading...";
      default:
        return "ข้อมูลไม่พบ";
    }
  };

  return (
    <div className="rounded-2xl odd:bg-lamaPruple even:bg-lamaPrupleLight p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {new Date().toLocaleDateString("th-TH", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </span>

        <Image src="/images/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{int}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
      <div className="mt-4">
        {loading ? (
          <p className="text-center mt-4">Loading...</p>
        ) : (
          <p>{renderData()}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
