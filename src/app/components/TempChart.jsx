import React from "react";
import ReactECharts from "echarts-for-react";

const TempChart = ({ sensorData }) => {
  if (!sensorData || !sensorData.environmental) return <p>❌ ไม่มีข้อมูล Sensor</p>;

  const temperatureData = sensorData.environmental.find((entry) =>
    entry.param.toLowerCase().includes("temperature")
  );

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

  // ✅ ดึงค่าข้อมูลล่าสุด
  const lastReading = temperatureData.readings[temperatureData.readings.length - 1];

  const option = {
    title: {
      left: "center",
      text: `อุณหภูมิของ Sensor ${sensorData.id}`,
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
        const timestamp = formatTimestamp(temperatureData.readings[index]?.timestamp);
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
      data: temperatureData.readings.map((reading) => formatTimestamp(reading.timestamp)),
      axisLabel: { rotate: -20 },
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
        data: temperatureData.readings.map((reading) => reading.value || 0),
        smooth: true,
        showSymbol: true,
        symbolSize: 10,
        itemStyle: { color: "#ffcc00" },
        areaStyle: {
          color: "rgba(255, 204, 0, 0.3)",
        },
        markPoint: {
          data: [
            { type: "max", name: "สูงสุด", symbolSize: 14, itemStyle: { color: "red" } },
            { type: "min", name: "ต่ำสุด", symbolSize: 14, itemStyle: { color: "blue" } },
          ],
        },
        markLine: {
          data: [
            { yAxis: 25, name: "อุณหภูมิปลอดภัย", lineStyle: { color: "green", type: "dashed" } },
          ],
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-md transition-all duration-500 dark:bg-gray-800">
      {/* ✅ แสดงอุณหภูมิล่าสุดแบบเด่นชัด */}
      <div className="text-start text-gray-800 dark:text-gray-100 mb-4">
        <h2 className="text-xl font-bold">
          อุณหภูมิล่าสุด: <span className="text-2xl text-red-500">
            {lastReading?.value.toFixed(2) || "N/A"}°C
          </span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          อัปเดตล่าสุด : {formatTimestamp(lastReading?.timestamp)}
        </p>
      </div>

      {/* ✅ แสดงกราฟ */}
      <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default TempChart;
