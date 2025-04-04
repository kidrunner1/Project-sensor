"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const HumidityChart = ({ sensorData }) => {
  const chartRef = useRef(null);
  const myChart = useRef(null);

  const [humidity, setHumidity] = useState(0);
  const [fakeClock, setFakeClock] = useState(new Date());

  const baseTimestampRef = useRef(null);
  const startClientTimeRef = useRef(null);

  const [isDarkTheme, setIsDarkTheme] = useState(
    () => document.documentElement.classList.contains("dark")
  );

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

  useEffect(() => {
    const humidityParam = sensorData?.environmental?.find((param) =>
      param.param.toLowerCase().includes("humidity")
    );

    const lastReading = humidityParam?.readings?.length
      ? humidityParam.readings[humidityParam.readings.length - 1]
      : null;

    const humidityValue = lastReading?.value
      ? parseFloat(lastReading.value.toFixed(2))
      : 0;

    setHumidity(humidityValue);

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

    if (!chartRef.current) return;
    if (!myChart.current) {
      myChart.current = echarts.init(chartRef.current, isDarkTheme ? "dark" : null);
    }

    const option = {
      series: [
        {
          type: "gauge",
          radius: "110%",
          center: ["50%", "55%"],
          startAngle: 225,
          endAngle: -45,
          min: 0,
          max: 100,
          pointer: {
            width: 3,
            length: "60%",
            itemStyle: { color: "#808080" },
          },
          axisLine: {
            lineStyle: {
              width: 14,
              color: [
                [0.3, "#4FC3F7"],
                [0.7, "#29B6F6"],
                [1, "#0288D1"],
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
            formatter: `{value} %RH`,
            color: isDarkTheme ? "#fff" : "#333",
            fontSize: 14,
          },
          data: [{ value: humidityValue }],
        },
      ],
    };

    myChart.current.setOption(option);
    myChart.current.resize();

    window.addEventListener("resize", () => myChart.current.resize());
    return () => {
      window.removeEventListener("resize", () => myChart.current.resize());
    };
  }, [sensorData, isDarkTheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (baseTimestampRef.current && startClientTimeRef.current) {
        const diff = Date.now() - startClientTimeRef.current.getTime();
        setFakeClock(new Date(baseTimestampRef.current.getTime() + diff));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatShortDate = (timestamp) => {
    if (!timestamp) return "ไม่มีข้อมูล";
    const date = new Date(timestamp);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${(date.getFullYear() + 543)
      .toString()
      .slice(-2)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  return (
    <div className="bg-white rounded-xl w-full p-4 shadow-md transition-all duration-500 dark:bg-gray-800 h-[400px]">
      <div className="flex flex-col items-start">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          ความชื้นสัมพัทธ์ (%RH)
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          เซ็นเซอร์ : {sensorData?.sensor_name || "ไม่ระบุ"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          อัปเดตล่าสุด : {formatShortDate(fakeClock)}
        </p>
      </div>

      <div className="grid place-items-center w-full overflow-visible">
        <div ref={chartRef} className="w-[250px] h-[220px]" />
      </div>

      <div className="text-center text-xs text-gray-600 dark:text-gray-300 mt-1">
        <p>💧 ค่าความชื้นที่สูงหรือต่ำเกินไป อาจส่งผลต่ออุปกรณ์หรือสุขภาพ</p>
        {humidity === 0 && (
          <p className="text-yellow-500">⚠️ ไม่มีข้อมูลความชื้น ระบบแสดงเป็น 0%RH</p>
        )}
      </div>
    </div>
  );
};

export default HumidityChart;
