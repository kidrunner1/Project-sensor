"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ✅ ค่าปลอดภัยของฟอร์มาลดีไฮด์ (ppm)
const SAFE_LIMIT = 0.1;

// ✅ Mock Data: จำลองค่าฟอร์มาลดีไฮด์ (เปอร์เซ็นต์ของแต่ละช่วง)
const mockData = [
  { name: "ปลอดภัย", value: 70 }, // 70% อยู่ในช่วงปลอดภัย
  { name: "อันตราย", value: 30 }, // 30% เกินค่าอันตราย
];

// ✅ สีที่ใช้แสดงผล (ปลอดภัย = เขียว, อันตราย = แดง)
const COLORS = ["#4CAF50", "#EF4444"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className={`p-2 rounded-md text-white text-sm`}
        style={{ backgroundColor: data.name === "ปลอดภัย" ? "#4CAF50" : "#EF4444" }}
      >
        <p className="font-semibold">{data.name}</p>
        <p>เปอร์เซ็นต์: {data.value}%</p>
      </div>
    );
  }
  return null;
};

const PieChartCH2O = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg transition-all duration-500">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          🍰 สัดส่วนค่าฟอร์มาลดีไฮด์ (CH₂O)
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">ข้อมูลจากการเก็บตัวอย่าง</span>
      </div>

      {/* ✅ กราฟ Pie Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Pie
            data={mockData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={5} // ✅ ทำให้ Pie Chart มีช่องว่างระหว่างเซกเมนต์
            dataKey="value"
            isAnimationActive={true} // ✅ เปิด Animation
            animationDuration={1000}
          >
            {mockData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* ✅ คำแนะนำเพิ่มเติม */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
        <p>📌 ค่า CH₂O ที่สูงเกิน 0.1 ppm อาจมีผลกระทบต่อสุขภาพ ควรตรวจสอบพื้นที่ที่มีความเสี่ยงสูง</p>
      </div>
    </div>
  );
};

export default PieChartCH2O;
