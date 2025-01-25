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

  useEffect(() => {
    const generateChartData = async () => {
      setLoading(true);

      // ดึงข้อมูลจาก API
      const weatherData = await fetchWeather("Bangkok");
      if (weatherData) {
        const now = new Date(); // เวลาปัจจุบัน
        const data = [];

        // สร้างข้อมูล 24 ชั่วโมงย้อนหลัง
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000); // ย้อนหลังทีละ 1 ชั่วโมง
          data.push({
            name: time.toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            อุณหภูมิ: weatherData.temperature - Math.random() * 5, // ตัวอย่างอุณหภูมิ
            ความชื้น: weatherData.humidity - Math.random() * 10, // ตัวอย่างความชื้น
          });
        }

        setChartData(data);
      }

      setLoading(false);
    };

    generateChartData();
  }, []);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">D/T (24 ชั่วโมงล่าสุด)</h1>
      </div>
      <div className="relative w-full h-[85%]">
        {loading ? (
          <p className="text-center mt-4">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              width={500}
              height={300}
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
              <Tooltip />
              <Legend
                align="center"
                verticalAlign="top"
                wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
              />
              <Line
                type="monotone"
                dataKey="อุณหภูมิ"
                stroke="#8884d8"
                strokeWidth={5}
              />
              <Line
                type="monotone"
                dataKey="ความชื้น"
                stroke="#82ca9d"
                strokeWidth={5}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BottomChart;
