"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ✅ ฟังก์ชันสร้างข้อมูลจำลองแบบ Real-time
const generateWeatherData = () => ({
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  rainfall: parseFloat((Math.random() * 20).toFixed(1)), // ฝนตก (mm)
  evaporation: parseFloat((Math.random() * 10).toFixed(1)), // การระเหย (mm)
});

const RainfallEvaporationChart = () => {
  const [chartData, setChartData] = useState([]);

  // ✅ อัปเดตข้อมูลแบบ Real-time ทุก 5 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData, generateWeatherData()];
        return newData.length > 10 ? newData.slice(1) : newData; // เก็บข้อมูลสูงสุด 10 จุด
      });
    }, 5000);

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  return (
    <div className="transition-all duration-500">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">🌧️ ปริมาณน้ำฝน & การระเหย - อัปเดตเรียลไทม์</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">อัปเดตทุก 5 วินาที</span>
      </div>

      {/* ✅ กราฟ Rainfall & Evaporation */}
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fill: "#aaa" }} />
          <YAxis label={{ value: "mm", angle: -90, position: "insideLeft", fill: "#aaa" }} />
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff", borderRadius: "5px" }} />
          <Legend />

          {/* ✅ Bar สำหรับปริมาณฝน */}
          <Bar dataKey="rainfall" fill="#3498db" barSize={50} radius={[10, 10, 0, 0]} animationDuration={1500} />

          {/* ✅ Bar สำหรับการระเหย */}
          <Bar dataKey="evaporation" fill="#e74c3c" barSize={50} radius={[10, 10, 0, 0]} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>

      {/* ✅ เพิ่ม Area Chart เพื่อทำให้ข้อมูลดู Smooth */}
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3498db" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorEvaporation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#e74c3c" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip />
          <Area type="monotone" dataKey="rainfall" stroke="#3498db" fill="url(#colorRainfall)" animationDuration={2000} />
          <Area type="monotone" dataKey="evaporation" stroke="#e74c3c" fill="url(#colorEvaporation)" animationDuration={2000} />
        </AreaChart>
      </ResponsiveContainer>

      {/* ✅ คำแนะนำเพิ่มเติม */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
        <p>📌 ค่าปริมาณน้ำฝนและการระเหยที่สูงผิดปกติ อาจมีผลกระทบต่อสิ่งแวดล้อมและการเกษตร</p>
      </div>
    </div>
  );
};

export default RainfallEvaporationChart;
