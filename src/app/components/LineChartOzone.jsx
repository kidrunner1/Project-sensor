"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// ✅ ค่ามาตรฐานของโอโซน (O₃) ใน ppb
const SAFE_LIMIT = 100; // ค่า O₃ ที่ปลอดภัย (ppb)
const DANGER_LIMIT = 150; // ค่า O₃ ที่อันตราย (ppb)

// ✅ Mock Data สำหรับการทดสอบ
const initialMockData = [
  { time: "00:00", o3: 50 },
  { time: "02:00", o3: 70 },
  { time: "04:00", o3: 90 },
  { time: "06:00", o3: 110 }, // 🚨 ค่าสูง
  { time: "08:00", o3: 130 }, // 🚨 ค่าสูง
  { time: "10:00", o3: 120 },
  { time: "12:00", o3: 100 },
  { time: "14:00", o3: 80 },
  { time: "16:00", o3: 60 },
  { time: "18:00", o3: 50 },
  { time: "20:00", o3: 40 },
  { time: "22:00", o3: 30 },
];

// ✅ สุ่มค่า O₃ ใหม่ (ใช้ใน Realtime)
const generateO3Data = () => ({
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  o3: Math.floor(Math.random() * 180), // สุ่มค่าระหว่าง 0 - 180 ppb
});

const LargeScaleAreaChartOzone = () => {
  const [chartData, setChartData] = useState(initialMockData);

  // ✅ ใช้ useEffect เพื่ออัปเดตค่าทุก 5 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData, generateO3Data()];

        // ✅ บันทึกข้อมูลลงใน localStorage
        localStorage.setItem("ozone_data", JSON.stringify(newData));
        return newData.length > 50 ? newData.slice(1) : newData; // เก็บข้อมูลสูงสุด 50 จุด
      });
    }, 5000);

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  return (
    <div className="transition-all duration-500">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">🌍 ค่ามลพิษโอโซน (O₃) - อัปเดตเรียลไทม์</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">อัปเดตทุก 5 วินาที</span>
      </div>

      {/* ✅ กราฟ Area Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart data={chartData}>
          <defs>
            {/* ✅ Gradient สีให้ Area Chart ดูทันสมัย */}
            <linearGradient id="colorO3" x1="0" y1="0" x2="0" y2="1">
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
          <YAxis label={{ value: "ppb", angle: -90, position: "insideLeft", fill: "#aaa" }} domain={[0, 200]} />
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff", borderRadius: "5px" }} />

          {/* ✅ เส้นแจ้งเตือนเมื่อค่าเกินมาตรฐาน */}
          <ReferenceLine y={SAFE_LIMIT} stroke="yellow" strokeDasharray="3 3" label="⚠️ ค่าปานกลาง" />
          <ReferenceLine y={DANGER_LIMIT} stroke="red" strokeDasharray="3 3" label="🚨 ค่าอันตราย" />

          {/* ✅ กราฟเส้น O₃ */}
          <Area type="monotone" dataKey="o3" stroke="#4F46E5" fill="url(#colorO3)" fillOpacity={1} />

          {/* ✅ ถ้าค่า O₃ เกิน 150 ppb ให้ใช้สีแดง */}
          {chartData.some((d) => d.o3 > DANGER_LIMIT) && (
            <Area type="monotone" dataKey="o3" stroke="#EF4444" fill="url(#colorDanger)" fillOpacity={1} />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* ✅ คำแนะนำเพิ่มเติม */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
        <p>📌 หากค่า O₃ เกิน 150 ppb อาจมีผลกระทบต่อสุขภาพ ควรหลีกเลี่ยงการออกกำลังกายกลางแจ้ง</p>
      </div>
    </div>
  );
};

export default LargeScaleAreaChartOzone;
