"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  defs,
  linearGradient,
  stop,
} from "recharts";
import { useState, useEffect } from "react";
import { fetchWeather } from "@/app/serviveAPI/Weather/weatherService"; // API ดึงข้อมูล

const BottomChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  useEffect(() => {
    const generateChartData = async () => {
      setLoading(true);

      const weatherData = await fetchWeather("Bangkok", selectedTimeRange);
      if (weatherData) {
        const now = new Date();
        const data = [];

        const hoursToFetch = selectedTimeRange === "24h" ? 24 : 7;
        for (let i = hoursToFetch - 1; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          const temp = Math.round(weatherData.temperature - Math.random() * 5);
          const humidity = Math.round(weatherData.humidity - Math.random() * 10);

          data.push({
            name: time.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
            อุณหภูมิ: temp,
            ความชื้น: humidity,
            tempColor:
              temp < 15 ? "#3498db" : temp > 30 ? "#e74c3c" : "#f39c12", // น้ำเงิน (เย็น), แดง (ร้อน), ส้ม (ปกติ)
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
        <h1 className="text-lg font-semibold">
          อุณหภูมิและความชื้น ({selectedTimeRange === "24h" ? "24 ชั่วโมงล่าสุด" : "7 วันล่าสุด"})
        </h1>
        <select
          className="bg-gray-100 p-2 rounded-md"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
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
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e74c3c" stopOpacity={1} /> {/* สีแดง อุณหภูมิสูง */}
                  <stop offset="50%" stopColor="#f39c12" stopOpacity={1} /> {/* สีส้ม อุณหภูมิปกติ */}
                  <stop offset="100%" stopColor="#3498db" stopOpacity={1} /> {/* สีน้ำเงิน อุณหภูมิต่ำ */}
                </linearGradient>
                <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#82ca9d" stopOpacity={1} />
                  <stop offset="100%" stopColor="#66bb6a" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" tick={{ fill: "#d1d5db" }} tickMargin={10} />
              <YAxis tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={10} />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  borderColor: "lightgray",
                  backgroundColor: "#333",
                  color: "#fff",
                }}
                formatter={(value, name) =>
                  `${name}: ${value} ${name === "อุณหภูมิ" ? "°C" : "%"}`
                }
              />
              <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }} />

              <Area
                type="monotone"
                dataKey="อุณหภูมิ"
                stroke="#c0392b"
                strokeWidth={3}
                fill="url(#colorTemp)"
                fillOpacity={0.6}
                dot={{ r: 6, fill: "#c0392b", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
              <Area
                type="monotone"
                dataKey="ความชื้น"
                stroke="#2ecc71"
                strokeWidth={3}
                fill="url(#colorHumidity)"
                fillOpacity={0.4}
                dot={{ r: 6, fill: "#2ecc71", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>คำแนะนำ: ตรวจสอบอุณหภูมิและความชื้นในช่วงเวลาที่มีความเสี่ยงสูง เพื่อปรับการทำงานของระบบให้เหมาะสม</p>
      </div>
    </div>
  );
};

export default BottomChart;
