"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const WindChart = ({ sensorData, selectedSensor }) => {
  const chartRef = useRef(null);
  let myChart = useRef(null);

  // ✅ ใช้ useState เก็บค่าความเร็วลมและ timestamp
  const [windSpeed, setWindSpeed] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState("ไม่มีข้อมูล");

  // ✅ กำหนดหน่วยการแสดงผล (เปลี่ยนได้ m/s หรือ km/h)
  const unit = "m/s"; // หรือเปลี่ยนเป็น "km/h"

  useEffect(() => {
    if (!chartRef.current || !sensorData || !selectedSensor) return;

    if (!myChart.current) {
      myChart.current = echarts.init(chartRef.current, null, { responsive: true });
    }

    // ✅ ดึงค่าความเร็วลมจาก `sensorData`
    const windSpeedParam = sensorData?.[selectedSensor]?.environmental?.find((param) =>
      param.param.toLowerCase().includes("wind")
    );

    if (!windSpeedParam) {
      setWindSpeed(0);
      setLastTimestamp("ไม่มีข้อมูล");
      return;
    }

    const formatShortDate = (timestamp) => {
      if (!timestamp) return "ไม่มีข้อมูล";
      const date = new Date(timestamp);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = (date.getFullYear() + 543).toString().slice(-2); // ✅ เอาแค่ 2 หลักสุดท้าย
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };


    // ✅ ดึงค่าล่าสุดจาก readings
    const lastReading = windSpeedParam?.readings?.[windSpeedParam.readings.length - 1] || {};
    let windSpeedValue = lastReading?.value ? parseFloat(lastReading.value.toFixed(2)) : 0;

    // ✅ แปลงหน่วย km/h ถ้าจำเป็น
    if (unit === "km/h") {
      windSpeedValue = (windSpeedValue * 3.6).toFixed(2);
    }

    const lastTimestampConverted = lastReading?.timestamp
      ? formatShortDate(lastReading.timestamp) // ✅ ใช้ฟังก์ชันใหม่
      : "ไม่มีข้อมูล";


    // ✅ อัปเดต State
    setWindSpeed(windSpeedValue);
    setLastTimestamp(lastTimestampConverted);

    // ✅ สีของ Gauge ตามระดับลม
    const gaugeColor =
      windSpeedValue < 3 ? "#67e0e3" : windSpeedValue < 7 ? "#37a2da" : "#fd666d";

    // ✅ อัปเดตค่าใน ECharts 
    const option = {
      series: [
        {
          type: "gauge",
          radius: "110%", // ✅ เล็กลง
          center: ['50%', '55%'], // ✅ ขยับให้อยู่สูงขึ้น
          startAngle: 225,
          endAngle: -45,
          pointer: {
            width: 3,
            length: "60%",
            itemStyle: { color: "#808080" },
          },
          axisLine: {
            lineStyle: {
              width: 14, // ✅ กรอบบางลง
              color: [
                [0.3, "#67e0e3"],
                [0.7, "#37a2da"],
                [1, "#fd666d"],
              ],
            },
          },
          axisLabel: {
            distance: 10,
            fontSize: 10,
          },
          splitLine: {
            length: 10, // ✅ ปรับขนาดเส้น division
            lineStyle: { color: '#999' }
          },
          axisTick: {
            length: 4, // ✅ ปรับขนาด tick
          },
          detail: {
            valueAnimation: true,
            formatter: `{value} ${unit}`,
            color: "#333",
            fontSize: 14,
          },
          animationDuration: 800,
          data: [{ value: windSpeed }],
        },
      ],
    };

    myChart.current.setOption(option);
    myChart.current.resize();

    window.addEventListener("resize", () => {
      myChart.current.resize();
    });

    return () => {
      window.removeEventListener("resize", () => myChart.current.resize());
    };

    // ✅ **เอา `unit` ออกจาก dependencies**
  }, [sensorData, selectedSensor, windSpeed]);


  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 h-[350px] flex flex-col justify-between shadow-md">
      {/* ✅ Title แยกออกมา */}
      <div className="flex flex-col items-start">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">ความเร็วลม ({unit})</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">เซ็นเซอร์: {selectedSensor}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">อัปเดตล่าสุด : {lastTimestamp}</p>
      </div>

      {/* ✅ Chart */}
      <div className="grid place-items-center w-full overflow-visible pt-2">
        <div ref={chartRef} className="w-[250px] h-[220px]" />
      </div>




      {/* ✅ คำอธิบาย */}
      <div className="text-center text-xs text-gray-600 dark:text-gray-300 mt-1">
        <p>⚠️ ความเร็วลมที่สูงอาจมีผลต่อโครงสร้าง</p>
      </div>

    </div>

  );
};

export default WindChart;
