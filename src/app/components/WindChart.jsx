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

    // ✅ ดึงค่าล่าสุดจาก readings
    const lastReading = windSpeedParam?.readings?.[windSpeedParam.readings.length - 1] || {};
    let windSpeedValue = lastReading?.value ? parseFloat(lastReading.value.toFixed(2)) : 0;

    // ✅ แปลงหน่วย km/h ถ้าจำเป็น
    if (unit === "km/h") {
      windSpeedValue = (windSpeedValue * 3.6).toFixed(2);
    }

    const lastTimestampConverted = lastReading?.timestamp
      ? new Date(lastReading.timestamp).toLocaleString("th-TH")
      : "ไม่มีข้อมูล";

    // ✅ อัปเดต State
    setWindSpeed(windSpeedValue);
    setLastTimestamp(lastTimestampConverted);

    // ✅ สีของ Gauge ตามระดับลม
    const gaugeColor =
      windSpeedValue < 3 ? "#67e0e3" : windSpeedValue < 7 ? "#37a2da" : "#fd666d";

    // ✅ อัปเดตค่าใน ECharts 
    const option = {
      title: {
        text: `เซ็นเซอร์ ${selectedSensor}`,
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#333",
        },
      },
      series: [
        {
          type: "gauge",
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.3, "#67e0e3"],  // ปลอดภัย 🟢
                [0.7, "#37a2da"],  // ปกติ 🔵
                [1, "#fd666d"],     // อันตราย 🔴
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: gaugeColor,
            },
          },
          axisLabel: {
            color: "inherit",
            distance: 40,
            fontSize: 18,
          },
          detail: {
            valueAnimation: true,
            formatter: `{value} ${unit}`, // ✅ แสดงค่า m/s หรือ km/h
            color: "inherit",
            fontSize: 24,
          },
          animationDuration: 1000, // ✅ เพิ่ม Animation ให้หมุน Smooth
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
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 h-[500px] flex flex-col justify-between transition-all duration-500 shadow-md">
      {/* ✅ ข้อมูลแสดงผลเพิ่มเติม */}
      <div className="text-start">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">ความเร็วลม ({unit})</h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">อัปเดตล่าสุด: {lastTimestamp}</p>
      </div>

      {/* ✅ แสดง Gauge Chart */}
      <div ref={chartRef} className="w-full h-full flex justify-center items-center" />

      {/* ✅ คำอธิบายเพิ่มเติม */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-300">
        <p>⚠️ ความเร็วลมที่สูงอาจมีผลต่อโครงสร้างหรือระบบที่ใช้ลม</p>
      </div>
    </div>
  );
};

export default WindChart;
