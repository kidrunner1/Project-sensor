"use client";

import { useEffect, useState } from "react";
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
import { fetchWeather } from "@/app/serviveAPI/Weather/weatherService"; // ดึงข้อมูล API

const AttendanceChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drilldown, setDrilldown] = useState(false);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);

      const location = "Bangkok"; // เปลี่ยนสถานที่ได้
      const weatherData = await fetchWeather(location, selectedTimeRange);

      if (weatherData) {
        const now = new Date();
        const data = [];
        const hoursToFetch = selectedTimeRange === "24h" ? 24 : 7;

        for (let i = hoursToFetch - 1; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          data.push({
            time: time.toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temperature: Math.round(weatherData.temperature - Math.random() * 5),
            windSpeed: Math.round(weatherData.wind - Math.random() * 5),
            drilldown: `Detail-${i}`,
          });
        }

        setChartData(data);
        setOriginalData(data); // เก็บข้อมูลต้นฉบับ
      }

      setLoading(false);
    };

    fetchChartData();
  }, [selectedTimeRange]);

  // ฟังก์ชันสำหรับ Drilldown (เปลี่ยนข้อมูลเมื่อคลิก)
  const handleBarClick = (data) => {
    if (!drilldown) {
      const filteredData = chartData.filter((item) => item.drilldown === data.drilldown);
      setChartData(filteredData.length > 0 ? filteredData : chartData);
      setDrilldown(true);
    } else {
      setChartData(originalData);
      setDrilldown(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <h1 className="text-lg font-semibold ">
          อุณหภูมิและความเร็วลม ({selectedTimeRange === "24h" ? "24 ชั่วโมงล่าสุด" : "7 วันล่าสุด"})
        </h1>
        <select
          className="bg-gray-100 text-black p-2 rounded-md"
          value={selectedTimeRange}
          onChange={(e) => {
            setSelectedTimeRange(e.target.value);
            setDrilldown(false); // รีเซ็ต Drilldown เมื่อเปลี่ยนช่วงเวลา
          }}
        >
          <option value="24h">24 ชั่วโมง</option>
          <option value="7d">7 วัน</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center mt-4 text-gray-400">Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis dataKey="time" tick={{ fill: "#d1d5db" }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                borderColor: "lightgray",
                backgroundColor: "#333",
                color: "#fff",
              }}
            />
            <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />

            {/* อุณหภูมิ */}
            <Bar
              name="อุณหภูมิ (°C)"
              dataKey="temperature"
              fill="#87CEEB"
              onClick={(data) => handleBarClick(data)}
            />

            {/* ความเร็วลม */}
            <Bar
              name="ความเร็วลม (km/h)"
              dataKey="windSpeed"
              fill="#FF6347"
              onClick={(data) => handleBarClick(data)}
            />
          </BarChart>
        </ResponsiveContainer>

      )}
      {drilldown && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            setChartData(originalData);
            setDrilldown(false);
          }}
        >
          กลับไปดูข้อมูลทั้งหมด
        </button>
      )}
      {/* คำแนะนำเพิ่มเติมหรือข้อความที่สำคัญ */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>คำแนะนำ: ตรวจสอบอุณหภูมิและความเร็วลมในช่วงเวลาที่มีความเสี่ยงสูง เพื่อปรับการทำงานของระบบให้เหมาะสม</p>
      </div>
    </div>
  );
};

export default AttendanceChart;
