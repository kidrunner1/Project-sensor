"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

// ✅ ฟังก์ชันสุ่มสีสำหรับแต่ละก๊าซ
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

    // ✅ สร้าง dataset สำหรับ ECharts
    const gasNames = [...new Set(gasData.map((gas) => gas.param))]; // ✅ ดึงชื่อก๊าซที่ไม่ซ้ำ
    const colors = gasNames.reduce((acc, gas) => ({ ...acc, [gas]: getRandomColor() }), {});

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

    const seriesData = gasNames.map((gas) => ({
      name: gas,
      type: "line",
      data: gasData
        .find((g) => g.param === gas)
        ?.readings.map((reading) => parseFloat(reading.value).toFixed(2)) || [], // ✅ แปลงเป็นทศนิยม 2 ตำแหน่ง
      smooth: true,
      itemStyle: { color: colors[gas] },
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
      legend: { data: gasNames, bottom: 0 },
      grid: { left: "10%", right: "10%", bottom: "15%", containLabel: true },
      xAxis: {
        type: "category",
        data: timestamps,
        axisLabel: { rotate: -30 },
      },
      yAxis: {
        type: "value",
        name: "ppm",
        axisLabel: {
          formatter: (value) => value.toFixed(2), // ✅ แสดงทศนิยม 2 ตำแหน่งบนแกน Y
        },
      },
      series: seriesData,
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
        📊 ค่าก๊าซในอากาศ - Sensor: {selectedSensor}
      </h2>
      <div ref={chartRef} className="w-full h-[500px]" />
    </div>
  );
};

export default LineChartGas;
