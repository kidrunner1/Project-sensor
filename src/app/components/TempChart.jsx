"use client";
import React, { useEffect, useState, useRef } from "react";
import ReactECharts from "echarts-for-react";

const TempChart = ({ sensorData, dateRange }) => {
  if (!sensorData || !sensorData.environmental) return <p>ไม่มีข้อมูล Sensor</p>;
  const temperatureData = sensorData.environmental.find((entry) =>
    entry.param.toLowerCase().includes("temperature")
  );
  if (!temperatureData || !Array.isArray(temperatureData.readings) || temperatureData.readings.length === 0) {
    return <p className="text-gray-900 dark:text-white">⏳ กำลังโหลดข้อมูลอุณหภูมิ...</p>;
  }
  const [fakeClock, setFakeClock] = useState(new Date());
  const baseTimestampRef = useRef(null);
  const startClientTimeRef = useRef(null);

  const lastReading = temperatureData.readings[temperatureData.readings.length - 1];


  const filterTodayData = (readings, latestTimestamp) => {
    const latestDate = new Date(latestTimestamp);
    const latestDay = latestDate.getDate();
    const latestMonth = latestDate.getMonth();
    const latestYear = latestDate.getFullYear();

    return readings.filter((r) => {
      const d = new Date(r.timestamp);
      return (
        d.getDate() === latestDay &&
        d.getMonth() === latestMonth &&
        d.getFullYear() === latestYear
      );
    });
  };

  // ✅ เช็คจริง ๆ ว่า timestamp เปลี่ยน
  useEffect(() => {
    if (!lastReading?.timestamp) return;

    const newTimestamp = new Date(lastReading.timestamp);

    if (
      !baseTimestampRef.current ||
      baseTimestampRef.current.getTime() !== newTimestamp.getTime()
    ) {
      baseTimestampRef.current = newTimestamp;
      startClientTimeRef.current = new Date();
    }
  }, [lastReading?.timestamp]);

  // ✅ ตั้ง fakeClock ให้เดินเองทุก 1 วิ
  useEffect(() => {
    const interval = setInterval(() => {
      if (baseTimestampRef.current && startClientTimeRef.current) {
        const diff = Date.now() - startClientTimeRef.current.getTime();
        setFakeClock(new Date(baseTimestampRef.current.getTime() + diff));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!temperatureData) return <p>❌ ไม่มีข้อมูลอุณหภูมิสำหรับ Sensor นี้</p>;

  // ✅ ฟังก์ชันแปลง timestamp
  // ✅ ฟังก์ชันแปลง timestamp ปีแค่ 2 หลัก
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

  const formatTimestampX = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDateShort = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = (date.getFullYear() + 543).toString().slice(-2); // เอา 2 หลักท้าย
    return `${day}/${month}/${year}`;
  };

  // const latestTimestamp = temperatureData.readings.at(-1)?.timestamp;
  const isDateRangeSelected = dateRange?.startDate && dateRange?.endDate;
  const getTodayReadings = (readings) => {
    const now = new Date();
    return readings.filter((r) => {
      const t = new Date(r.timestamp);
      return (
        t.getDate() === now.getDate() &&
        t.getMonth() === now.getMonth() &&
        t.getFullYear() === now.getFullYear()
      );
    });
  };

  const readings = isDateRangeSelected
    ? temperatureData.readings
    : getTodayReadings(temperatureData.readings);

  const option = {
    title: {
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "15%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      formatter: (params) => {
        const index = params[0].dataIndex;
        const timestamp = formatTimestamp(readings[index]?.timestamp);
        return `
          <div style="text-align: center;">
            <strong>อุณหภูมิ</strong><br/>
            ${timestamp}<br/>
            <strong>${params[0].value.toFixed(2)}</strong>°C
          </div>
        `;
      },
    },
    xAxis: {
      type: "category",
      data: readings.map((reading) => formatTimestampX(reading.timestamp)),
      show: true,
    },
    yAxis: {
      type: "value",
      name: "อุณหภูมิ (°C)",
      axisLabel: {
        formatter: (value) => `${value.toFixed(2)}°C`,
      },
    },
    series: [
      {
        name: "Temperature",
        type: "line",
        data: readings.map((reading) => reading.value || 0),
        smooth: true,
        showSymbol: true,
        symbolSize: 10,
        itemStyle: { color: "#ffcc00" },
        areaStyle: {
          color: "rgba(255, 204, 0, 0.3)",
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-md transition-all duration-500 dark:bg-gray-800">
      {/* ✅ แสดงอุณหภูมิล่าสุดแบบเด่นชัด */}
      <div className="text-start text-gray-800 dark:text-gray-100 mb-4">
        <h2 className="text-xl font-bold">
          อุณหภูมิ
        </h2>
        <p></p>
        <p className="text-sm text-gray-500 dark:text-gray-400">เซ็นเซอร์ : {sensorData.sensor_name || "ไม่พบชื่อเซ็นเซอร์"}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          อัปเดตล่าสุด : {formatTimestamp(fakeClock)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ช่วงวันที่เลือก :{" "}
          {dateRange?.startDate && dateRange?.endDate
            ? `${formatDateShort(dateRange.startDate)} ถึง ${formatDateShort(dateRange.endDate)}`
            : "วันนี้"}
        </p>
      </div>
      {/* ✅ แสดงกราฟ */}
      {readings.length > 0 && (
        <ReactECharts option={option} style={{ height: "300px", width: "100%" }} />
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        ⚠️ หากอุณหภูมิสูงหรือต่ำเกินไป อาจเป็นสัญญาณของความผิดปกติในระบบหรือสภาพแวดล้อม
      </p>
    </div>
  );
};

export default TempChart;
