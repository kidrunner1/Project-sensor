"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const SAFE_LIMITS = {
  ch2o: 0.1,
  o3: 0.05,
  co: 9,
  no2: 0.1,
};

const FIXED_GAS_COLORS = {
  h2h3: "#FF6B6B",  // สีแดงอ่อน
  o3: "#4BC0C0",    // ฟ้า
  co: "#F9A825",    // เหลืองเข้ม
  no2: "#9575CD",   // ม่วง
};

const LineChartGas = ({ gasData, selectedSensor }) => {
  const chartRef = useRef(null);
  let myChart = useRef(null);

  const [fakeClock, setFakeClock] = useState(new Date());
  const baseTimestampRef = useRef(null);
  const startClientTimeRef = useRef(null);

  const [isDarkTheme, setIsDarkTheme] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = (date.getFullYear() + 543).toString().slice(-2); // เอา 2 หลักท้าย
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // ✅ ตรวจจับธีมเมื่อมีการเปลี่ยน dark/light
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

  // ✅ เวลาปลอมให้เดินทุกวินาที
  useEffect(() => {
    const interval = setInterval(() => {
      if (baseTimestampRef.current && startClientTimeRef.current) {
        const diff = Date.now() - startClientTimeRef.current.getTime();
        setFakeClock(new Date(baseTimestampRef.current.getTime() + diff));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartRef.current || gasData.length === 0) return;

    if (!myChart.current) {
      myChart.current = echarts.init(chartRef.current, isDarkTheme ? "dark" : null);
    }

    const gasNames = [...new Set(gasData.map((gas) => gas.param))];
    const colors = gasNames.reduce((acc, gas) => {
      const gasKey = gas.toLowerCase();
      return { ...acc, [gas]: FIXED_GAS_COLORS[gasKey] || "#999999" };
    }, {});

    const timestamps = gasData[0]?.readings?.map((reading) => reading.timestamp) || [];

    // ✅ อัปเดต baseTimestamp ถ้ามีข้อมูลใหม่
    const latestReading = gasData[0]?.readings?.[gasData[0].readings.length - 1];
    if (latestReading?.timestamp) {
      const newTimestamp = new Date(latestReading.timestamp);
      if (
        !baseTimestampRef.current ||
        baseTimestampRef.current.getTime() !== newTimestamp.getTime()
      ) {
        baseTimestampRef.current = newTimestamp;
        startClientTimeRef.current = new Date();
      }
    }

    const seriesData = gasNames.map((gas) => {
      const gasReadings = gasData.find((g) => g.param === gas)?.readings || [];
      const values = gasReadings.map((reading) => parseFloat(reading.value).toFixed(2)) || [];

      return {
        name: gas,
        type: "line",
        smooth: true,
        showSymbol: false,
        itemStyle: { color: colors[gas] },
        lineStyle: { width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[gas] },
            { offset: 1, color: "rgba(255,255,255,0)" },
          ]),
        },
        data: values,
        markPoint: {
          data: [
            { type: "max", name: "สูงสุด", symbol: "triangle", symbolSize: 12, itemStyle: { color: "red" } },
            { type: "min", name: "ต่ำสุด", symbol: "triangle", symbolSize: 12, itemStyle: { color: "blue" } },
          ],
        },
        animationDuration: 2000,
      };
    });

    const referenceLines = Object.entries(SAFE_LIMITS)
      .filter(([gas]) => gasNames.includes(gas))
      .map(([gas, limit]) => ({
        name: `${gas.toUpperCase()} Safe Limit`,
        type: "line",
        data: Array(timestamps.length).fill(limit),
        lineStyle: { type: "dashed", width: 2, color: "red" },
        label: { show: true, position: "right", formatter: `${gas.toUpperCase()} ⚠️` },
      }));

    const option = {
      title: {
        text: `ค่าก๊าซ (PPM) - Sensor: ${selectedSensor}`,
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: (params) => {
          let tooltipText = `<strong>ค่าก๊าซ (ล่าสุด)</strong><br/>`;
          params.forEach((item) => {
            tooltipText += `${item.marker} ${item.seriesName}: <strong>${item.value}</strong> ppm<br/>`;
          });
          return tooltipText;
        },
      },
      legend: {
        data: [...gasNames, ...referenceLines.map((line) => line.name)],
        bottom: 0,
        selectedMode: "multiple",
      },
      grid: { left: "10%", right: "10%", bottom: "20%", containLabel: true },
      xAxis: {
        type: "category",
        data: timestamps.map((ts) => formatTimestamp(ts)),
        axisLabel: {
          rotate: -20,
          fontSize: 10,
          color: isDarkTheme ? "#ccc" : "#333",
          show: false, // รองรับ Dark mode
        },
      },
      yAxis: {
        type: "value",
        name: "ppm",
        axisLabel: {
          formatter: (value) => parseFloat(value).toFixed(2),
        },
      },
      series: [...seriesData, ...referenceLines],
    };

    myChart.current.setOption(option);
    myChart.current.resize();

    window.addEventListener("resize", () => myChart.current.resize());

    return () => {
      window.removeEventListener("resize", () => myChart.current.resize());
    };
  }, [gasData, selectedSensor, isDarkTheme]);

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
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-md transition-all duration-500 dark:bg-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white text-start">
        ค่าก๊าซในอากาศ - Sensor: {selectedSensor}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">
        อัปเดตล่าสุด : {formatShortDate(fakeClock)}
      </p>

      <div ref={chartRef} className="w-full h-[500px]" />
        
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        ✅ <strong>คำแนะนำ:</strong> คลิกชื่อก๊าซที่ด้านล่างกราฟ เพื่อเปิด/ปิดการแสดงผลของแต่ละตัว
        <br />
        ⚠️ ค่าก๊าซที่สูงกว่ามาตรฐานอาจส่งผลกระทบต่อสุขภาพ
        <br />
        🟢 ปลอดภัย: อยู่ในช่วงปกติ
        🔵 เฝ้าระวัง: อาจมีผลกระทบในระยะยาว
        🔴 อันตราย: ควรหลีกเลี่ยงพื้นที่และใช้หน้ากากป้องกัน
      </p>

    </div>
  );
};

export default LineChartGas;
