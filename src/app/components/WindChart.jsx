"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const WindChart = ({ sensorData, selectedSensor }) => {
  const chartRef = useRef(null);
  let myChart = useRef(null);

  const [windSpeed, setWindSpeed] = useState(0);
  const [fakeClock, setFakeClock] = useState(new Date());

  const baseTimestampRef = useRef(null);
  const startClientTimeRef = useRef(null);

  const unit = "m/s"; // หรือเปลี่ยนเป็น "km/h"

  useEffect(() => {
    if (!chartRef.current || !sensorData || !selectedSensor) return;

    if (!myChart.current) {
      myChart.current = echarts.init(chartRef.current, null, { responsive: true });
    }

    const windSpeedParam = sensorData?.[selectedSensor]?.environmental?.find((param) =>
      param.param.toLowerCase().includes("wind")
    );

    if (!windSpeedParam) {
      setWindSpeed(0);
      return;
    }

    const lastReading = windSpeedParam?.readings?.[windSpeedParam.readings.length - 1] || {};
    let windSpeedValue = lastReading?.value ? parseFloat(lastReading.value.toFixed(2)) : 0;

    if (unit === "km/h") {
      windSpeedValue = (windSpeedValue * 3.6).toFixed(2);
    }

    // ✅ ตั้งเวลาพื้นฐาน (baseTimestamp) และเวลาเริ่มฝั่ง client (startClientTime)
    if (lastReading?.timestamp) {
      const newTimestamp = new Date(lastReading.timestamp);
      if (
        !baseTimestampRef.current ||
        baseTimestampRef.current.getTime() !== newTimestamp.getTime()
      ) {
        baseTimestampRef.current = newTimestamp;
        startClientTimeRef.current = new Date();
      }
    }

    setWindSpeed(windSpeedValue);

    const gaugeColor =
      windSpeedValue < 3 ? "#67e0e3" : windSpeedValue < 7 ? "#37a2da" : "#fd666d";

    const option = {
      series: [
        {
          type: "gauge",
          radius: "110%",
          center: ['50%', '55%'],
          startAngle: 225,
          endAngle: -45,
          pointer: {
            width: 3,
            length: "60%",
            itemStyle: { color: "#808080" },
          },
          axisLine: {
            lineStyle: {
              width: 14,
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
            length: 10,
            lineStyle: { color: '#999' }
          },
          axisTick: {
            length: 4,
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
  }, [sensorData, selectedSensor]);

  // ✅ ให้ fakeClock เดินทุกวินาที
  useEffect(() => {
    const interval = setInterval(() => {
      if (baseTimestampRef.current && startClientTimeRef.current) {
        const diff = Date.now() - startClientTimeRef.current.getTime();
        setFakeClock(new Date(baseTimestampRef.current.getTime() + diff));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ ฟังก์ชันแปลง timestamp
  const formatShortDate = (timestamp) => {
    if (!timestamp) return "ไม่มีข้อมูล";
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = (date.getFullYear() + 543).toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 h-[350px] flex flex-col justify-between shadow-md">
      {/* ✅ Title Section */}
      <div className="flex flex-col items-start">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">ความเร็วลม ({unit})</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">เซ็นเซอร์ : {selectedSensor}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          อัปเดตล่าสุด : {formatShortDate(fakeClock)}
        </p>
      </div>

      {/* ✅ Chart */}
      <div className="grid place-items-center w-full overflow-visible pt-2">
        <div ref={chartRef} className="w-[250px] h-[220px]" />
      </div>

      {/* ✅ Description */}
      <div className="text-center text-xs text-gray-600 dark:text-gray-300 mt-1">
        <p>⚠️ ความเร็วลมที่สูงอาจมีผลต่อโครงสร้าง</p>
      </div>
    </div>
  );
};

export default WindChart;
