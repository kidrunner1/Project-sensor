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

  // ✅ ตรวจสอบธีมแบบ dynamic
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  // ✅ ตรวจสอบการเปลี่ยนแปลงของธีม
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ ตรวจสอบการเปลี่ยนแปลงของ sensorData และ selectedSensor
  useEffect(() => {
    if (!chartRef.current || !sensorData || !selectedSensor) return;

    if (!myChart.current) {
      myChart.current = echarts.init(chartRef.current, isDarkTheme ? "dark" : null);
    }

    // ✅ ตรวจสอบว่ามีข้อมูลเซ็นเซอร์หรือไม่
    const windSpeedParam = sensorData?.[selectedSensor]?.environmental?.find((param) =>
      param.param.toLowerCase().includes("wind_speed")
    );

    if (!windSpeedParam) {
      setWindSpeed(0);
      return;
    }

    // ✅ ตรวจสอบว่ามีการอ่านค่าหรือไม่
    const lastReading = windSpeedParam?.readings?.[windSpeedParam.readings.length - 1] || {};
    let windSpeedValue = lastReading?.value ? parseFloat(lastReading.value.toFixed(2)) : 0;

    if (unit === "km/h") {
      windSpeedValue = (windSpeedValue * 3.6).toFixed(2);
    }

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
    
    // ✅ ปรับขนาดกราฟให้เหมาะสมกับธีม
    const option = {
      series: [
        {
          type: "gauge",
          radius: "110%",
          center: ["50%", "55%"],
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
                [0.3, "#FAE27C"],
                [0.7, "#FFA07A"],
                [1, "#fd666d"],
              ],
            },
          },
          axisLabel: {
            distance: 20,
            fontSize: 10,
            color: isDarkTheme ? "#fff" : "#333",
          },
          splitLine: {
            length: 10,
            lineStyle: { color: "#999" },
          },
          axisTick: {
            length: 4,
          },
          detail: {
            valueAnimation: true,
            formatter: `{value} ${unit}`,
            color: isDarkTheme ? "#fff" : "#333",
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
  }, [sensorData, selectedSensor, isDarkTheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (baseTimestampRef.current && startClientTimeRef.current) {
        const diff = Date.now() - startClientTimeRef.current.getTime();
        setFakeClock(new Date(baseTimestampRef.current.getTime() + diff));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ ฟังก์ชันสำหรับจัดรูปแบบวันที่และเวลา
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
    <div className="bg-white rounded-xl w-full p-4 shadow-md transition-all duration-500 dark:bg-gray-800 h-[400px]">
      <div className="flex flex-col items-start">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">ความเร็วลม ({unit})</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          เซ็นเซอร์ : {sensorData?.[selectedSensor]?.sensor_name || selectedSensor}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          อัปเดตล่าสุด : {formatShortDate(fakeClock)}
        </p>
      </div>

      <div className="grid place-items-center w-full overflow-visible ">
        <div ref={chartRef} className="w-[250px] h-[220px]" />
      </div>

      <div className="text-center text-xs text-gray-600 dark:text-gray-300 mt-1">
        <p>⚠️ ความเร็วลมที่สูงอาจมีผลต่อโครงสร้าง</p>
      </div>
    </div>
  );
};

export default WindChart;
