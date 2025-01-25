"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { fetchWeather } from "../weatherService"; // ดึงข้อมูล API

const AttendanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);

      const location = "Bangkok"; // เปลี่ยนสถานที่ได้
      const weatherData = await fetchWeather(location);

      if (weatherData) {
        const data = [];
        const now = new Date();

        // สร้างข้อมูล 24 ชั่วโมงย้อนหลัง
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000); // ย้อนหลังทีละ 1 ชั่วโมง

          // ใช้ข้อมูลที่ได้จาก API สำหรับอุณหภูมิและความเร็วลม
          data.push({
            name: time.toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temp: weatherData.temperature - Math.random() * 5, // จำลองการเปลี่ยนแปลงอุณหภูมิ
            wind: weatherData.wind - Math.random() * 5, // จำลองการเปลี่ยนแปลงความเร็วลม
          });
        }

        setChartData(data);
      }

      setLoading(false);
    };

    fetchChartData();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold">
          อุณหภูมิและความเร็วลม (24 ชั่วโมงล่าสุด)
        </h1>
      </div>
      <div className="relative w-full h-[85%]">
        {loading ? (
          <p className="text-center mt-4">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart width={500} height={300} data={chartData} barSize={20}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ddd"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tick={{ fill: "#d1d5db" }}
              />
              <YAxis axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  borderColor: "lightgray",
                }}
              />
              <Legend
                align="left"
                verticalAlign="top"
                wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
              />
              <Bar
                name="อุณหภูมิ (°C)"
                dataKey="temp"
                fill="#B0E0E6"
                legendType="circle"
              />
              <Bar
                name="ความเร็วลม (km/h)"
                dataKey="wind"
                fill="#FFA07A"
                legendType="circle"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AttendanceChart;
