"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { fetchWeather } from "../weatherService"; // ดึงข้อมูล API

const BottomChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h"); // ช่วงเวลาที่เลือก

  useEffect(() => {
    const generateChartData = async () => {
      setLoading(true);

      // ดึงข้อมูลจาก API
      const weatherData = await fetchWeather("Bangkok", selectedTimeRange);
      if (weatherData) {
        const now = new Date(); // เวลาปัจจุบัน
        const data = [];

        // สร้างข้อมูล 24 ชั่วโมงย้อนหลัง
        const hoursToFecth = selectedTimeRange === "24h" ? 24 : 7; // กำหนดจำนวนชั่วโมงที่ต้องการดึงข้อมูล
        for (let i = hoursToFecth - 1; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000); // ย้อนหลังทีละ 1 ชั่วโมง
          data.push({
            name: time.toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            อุณหภูมิ: Math.round(weatherData.temperature - Math.random() * 5), // ปัดเศษอุณหภูมิ
            ความชื้น: Math.round(weatherData.humidity - Math.random() * 10), // ปัดเศษความชื้น
          });
        }

        setChartData(data);
      }

      setLoading(false);
    };

    generateChartData();
  }, [selectedTimeRange]);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">อุณหภูมิและความชื้น ({selectedTimeRange === "24h" ? "24 ชั่วโมงล่าสุด" : "7 วันล่าสุด"})</h1>
        <select
          className="bg-gray-100 p-2 rounded-md"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)} // เปลี่ยนช่วงเวลาที่เลือก
        >
          <option value="24h">24 ชั่วโมง</option>
          <option value="7d">7 วัน</option>
        </select>
      </div>
      <div className="relative w-full h-[85%]">
        {loading ? (
          <p className="text-center mt-4">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tick={{ fill: "#d1d5db" }}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#d1d5db" }}
                tickLine={false}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  borderColor: "lightgray",
                  backgroundColor: "#333", // ทำให้ tooltip มองเห็นง่ายในธีมมืด
                  color: "#fff", // ใช้สีขาวเพื่อให้ดูชัด
                }}
                formatter={(value, name) => `${name}: ${value} ${name === "อุณหภูมิ" ? "°C" : "%"}`}
              />
              <Legend
                align="center"
                verticalAlign="top"
                wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
              />
              <Line
                type="monotone"
                dataKey="อุณหภูมิ"
                stroke="#FF6347" // ใช้สีแดงสำหรับอุณหภูมิ
                strokeWidth={3}
                dot={{ r: 6, fill: "#FF6347", stroke: "#fff", strokeWidth: 2 }} // เพิ่มจุดเมื่อ hover
                activeDot={{ r: 8 }} // เพิ่มจุดเมื่อ hover
              />
              <Line
                type="monotone"
                dataKey="ความชื้น"
                stroke="#82ca9d" // สีเขียวอ่อนสำหรับความชื้น
                strokeWidth={3}
                dot={{ r: 6, fill: "#82ca9d", stroke: "#fff", strokeWidth: 2 }} // เพิ่มจุดเมื่อ hover
                activeDot={{ r: 8 }} // เพิ่มจุดเมื่อ hover
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        {/* คำแนะนำเพิ่มเติมหรือข้อความที่สำคัญ */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>คำแนะนำ: ตรวจสอบอุณหภูมิและความชื้นในช่วงเวลาที่มีความเสี่ยงสูง เพื่อปรับการทำงานของระบบให้เหมาะสม</p>
        </div>
      </div>

    </div>
  );
};


export default BottomChart;
