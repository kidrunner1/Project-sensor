"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

// ✅ ค่ามาตรฐานปลอดภัยของแต่ละก๊าซ (ppm)
const SAFE_LIMITS = {
  ch2o: 0.1,  // ฟอร์มาลดีไฮด์ (ppm)
  o3: 0.05,   // โอโซน (ppm)
  co: 9,      // คาร์บอนมอนอกไซด์ (ppm)
  no2: 0.1,   // ไนโตรเจนไดออกไซด์ (ppm)
};

// ✅ ฟังก์ชันสุ่มสี
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const LineChartGas = ({ gasData, selectedSensor }) => {
  const chartRef = useRef(null);
  let myChart = useRef(null);

  useEffect(() => {
    if (!chartRef.current || gasData.length === 0) return;

    if (!myChart.current) {
      myChart.current = echarts.init(chartRef.current);
    }

    // ✅ ดึงชื่อก๊าซจากข้อมูล
    const gasNames = [...new Set(gasData.map((gas) => gas.param))];
    const colors = gasNames.reduce((acc, gas) => ({ ...acc, [gas]: getRandomColor() }), {});

    // ✅ แปลง Timestamp เป็น `DD/MM/YYYY HH:mm:ss`
    const timestamps = gasData[0]?.readings?.map((reading) =>
      new Date(reading.timestamp).toLocaleString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    ) || [];

    // ✅ สร้าง Series ข้อมูลแต่ละก๊าซ
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

    // ✅ Reference Lines สำหรับค่ามาตรฐานปลอดภัย
    const referenceLines = Object.entries(SAFE_LIMITS)
      .filter(([gas]) => gasNames.includes(gas))
      .map(([gas, limit]) => ({
        name: `${gas.toUpperCase()} Safe Limit`,
        type: "line",
        data: Array(timestamps.length).fill(limit),
        lineStyle: { type: "dashed", width: 2, color: "red" },
        label: { show: true, position: "right", formatter: `${gas.toUpperCase()} ⚠️` },
      }));

    // ✅ ตั้งค่า ECharts
    const option = {
      title: {
        text: `ค่าก๊าซ (ppm) - Sensor: ${selectedSensor}`,
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: (params) => {
          let tooltipText = `<strong>${params[0].axisValue}</strong><br/>`;
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
        data: timestamps,
        axisLabel: { rotate: -30 },
      },
      yAxis: {
        type: "value",
        name: "ppm",
        axisLabel: { formatter: (value) => parseFloat(value).toFixed(2) },
      },
      series: [...seriesData, ...referenceLines],
    };

    myChart.current.setOption(option);
    window.addEventListener("resize", () => myChart.current.resize());

    return () => {
      window.removeEventListener("resize", () => myChart.current.resize());
    };
  }, [gasData, selectedSensor]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white text-start">
        ค่าก๊าซในอากาศ - Sensor: {selectedSensor}
      </h2>
      <div ref={chartRef} className="w-full h-[500px]" />

      {/* ✅ คำแนะนำด้านล่างกราฟ */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        ⚠️ <strong>คำแนะนำ:</strong> ค่าก๊าซที่สูงกว่ามาตรฐานอาจส่งผลกระทบต่อสุขภาพ
        <br />
        🟢 ปลอดภัย: อยู่ในช่วงปกติ  
        🔵 เฝ้าระวัง: อาจมีผลกระทบในระยะยาว  
        🔴 อันตราย: ควรหลีกเลี่ยงพื้นที่และใช้หน้ากากป้องกัน  
      </p>
    </div>
  );
};

export default LineChartGas;
