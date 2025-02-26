"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

// ✅ Mock Data: แทนการเรียก API
const generateMockData = (timeRange) => {
  const now = new Date();
  let data = [];
  const hoursToFetch = timeRange === "24h" ? 24 : 7; // 24 ชั่วโมง หรือ 7 วัน

  for (let i = hoursToFetch - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      timeLabel: timeRange === "24h"
        ? time.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
        : time.toLocaleDateString("th-TH", { weekday: "short", day: "2-digit", month: "short" }),
      temperature: Math.round(25 + Math.random() * 10), // สุ่มค่าอุณหภูมิ 25-35°C
      windSpeed: Math.round(5 + Math.random() * 10), // สุ่มค่าความเร็วลม 5-15 km/h
      drilldown: `Detail-${i}`,
    });
  }

  return data;
};

const AttendanceChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [chartData, setChartData] = useState(generateMockData("24h"));
  const [drilldown, setDrilldown] = useState(false);
  const [originalData, setOriginalData] = useState(chartData);

  useEffect(() => {
    const newData = generateMockData(selectedTimeRange);
    setChartData(newData);
    setOriginalData(newData);
    setDrilldown(false);
  }, [selectedTimeRange]);

  // ฟังก์ชันสำหรับ Drilldown (กรองข้อมูลเมื่อคลิก)
  const handleBarClick = (params) => {
    if (!drilldown) {
      const filteredData = chartData.filter((item) => item.drilldown === params.name);
      setChartData(filteredData.length > 0 ? filteredData : chartData);
      setDrilldown(true);
    } else {
      setChartData(originalData);
      setDrilldown(false);
    }
  };

  // 🔥 ECharts Option
  const option = {
    title: {
      text: `อุณหภูมิและความเร็วลม (${selectedTimeRange === "24h" ? "24 ชั่วโมงล่าสุด" : "7 วันล่าสุด"})`,
      left: "center",
      textStyle: { fontSize: 16, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    dataZoom: [
      { type: "inside" }, // ซูมด้วย Scroll
      { type: "slider" }, // Slider ด้านล่าง
    ],
    xAxis: {
      type: "category",
      data: chartData.map((item) => item.timeLabel),
    },
    yAxis: {
      type: "value",
      name: "ค่า",
    },
    series: [
      {
        name: "อุณหภูมิ (°C)",
        type: "bar",
        data: chartData.map((item) => item.temperature),
        itemStyle: { color: "#87CEEB" }, // สีฟ้า
        emphasis: { focus: "series" },
        label: { show: true, position: "top" },
      },
      {
        name: "ความเร็วลม (km/h)",
        type: "bar",
        data: chartData.map((item) => item.windSpeed),
        itemStyle: { color: "#FF6347" }, // สีแดง
        emphasis: { focus: "series" },
        label: { show: true, position: "top" },
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <h1 className="text-lg font-semibold">
          อุณหภูมิและความเร็วลม ({selectedTimeRange === "24h" ? "24 ชั่วโมงล่าสุด" : "7 วันล่าสุด"})
        </h1>
        <select
          className="bg-gray-100 text-black p-2 rounded-md"
          value={selectedTimeRange}
          onChange={(e) => {
            setSelectedTimeRange(e.target.value);
            setDrilldown(false);
          }}
        >
          <option value="24h">24 ชั่วโมง</option>
          <option value="7d">7 วัน</option>
        </select>
      </div>

      <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />

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
