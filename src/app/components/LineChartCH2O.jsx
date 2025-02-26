"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// ✅ ค่าปลอดภัยของฟอร์มาลดีไฮด์ (ppm)
const SAFE_LIMIT = 0.1;

// ✅ Mock Data: ข้อมูลเริ่มต้นของวัน
const initialMockData = [
  { time: "00:00", ch2o: 0.05 },
  { time: "02:00", ch2o: 0.07 },
  { time: "04:00", ch2o: 0.06 },
  { time: "06:00", ch2o: 0.08 },
  { time: "08:00", ch2o: 0.1 },
  { time: "10:00", ch2o: 0.12 }, // 🚨 ค่าสูง
  { time: "12:00", ch2o: 0.14 }, // 🚨 ค่าสูง
  { time: "14:00", ch2o: 0.09 },
  { time: "16:00", ch2o: 0.08 },
  { time: "18:00", ch2o: 0.06 },
  { time: "20:00", ch2o: 0.05 },
  { time: "22:00", ch2o: 0.04 },
];

// ✅ สุ่มค่าฟอร์มาลดีไฮด์ใหม่ เพื่อใช้ใน Realtime
const generateCH2OData = () => ({
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  ch2o: parseFloat((Math.random() * 0.15).toFixed(3)), // ค่าสุ่มระหว่าง 0 - 0.15 ppm
});

const LargeScaleAreaChartCH2O = () => {
  const [chartData, setChartData] = useState([]);

  // ✅ โหลดข้อมูลจาก localStorage (ถ้ามี)
  useEffect(() => {
    const savedData = localStorage.getItem("ch2o_data");
    if (savedData) {
      setChartData(JSON.parse(savedData));
    } else {
      setChartData(initialMockData); // ใช้ Mock Data ถ้ายังไม่มีข้อมูล
    }
  }, []);

  // ✅ ใช้ useEffect เพื่ออัปเดตกราฟทุก ๆ 5 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData, generateCH2OData()];
        if (newData.length > 50) newData.shift(); // จำกัดข้อมูลไม่ให้เยอะเกินไป

        // ✅ บันทึกข้อมูลลงใน localStorage
        localStorage.setItem("ch2o_data", JSON.stringify(newData));

        return newData;
      });
    }, 5000);

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 transition-all duration-500">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">🌎 ค่าฟอร์มาลดีไฮด์ (CH₂O) - อัปเดตเรียลไทม์</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">อัปเดตทุก 5 วินาที</span>
      </div>

      {/* ✅ กราฟ Area Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart data={chartData}>
          <defs>
            {/* ✅ Gradient สีให้ Area Chart ดูทันสมัย */}
            <linearGradient id="colorCH2O" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDanger" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fill: "#aaa" }} />
          <YAxis label={{ value: "ppm", angle: -90, position: "insideLeft", fill: "#aaa" }} domain={[0, 0.15]} />
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff", borderRadius: "5px" }} />
          <ReferenceLine y={SAFE_LIMIT} stroke="red" strokeDasharray="3 3" label="⚠️ ค่าอันตราย" />

          {/* ✅ Area Chart */}
          <Area type="monotone" dataKey="ch2o" stroke="#4F46E5" fillOpacity={1} fill="url(#colorCH2O)" />

          {/* ✅ ถ้าค่าเกิน 0.1 ppm ให้ใช้สีแดง */}
          {chartData.some((d) => d.ch2o > SAFE_LIMIT) && (
            <Area type="monotone" dataKey="ch2o" stroke="#EF4444" fillOpacity={1} fill="url(#colorDanger)" />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* ✅ คำแนะนำเพิ่มเติม */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
        <p>📌 ค่าฟอร์มาลดีไฮด์ที่สูงเกิน 0.1 ppm อาจมีความเสี่ยงต่อสุขภาพ ควรตรวจสอบการระบายอากาศ</p>
      </div>
    </div>
  );
};

export default LargeScaleAreaChartCH2O;
