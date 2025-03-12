import React from "react";
import ReactECharts from "echarts-for-react";

const TempChart = ({ sensorData }) => {
  if (!sensorData || !sensorData.environmental) return <p>❌ ไม่มีข้อมูล Sensor</p>;

  const temperatureData = sensorData.environmental.find((entry) => 
    entry.param.toLowerCase().includes("temperature")
  );

  if (!temperatureData) return <p>❌ ไม่มีข้อมูลอุณหภูมิสำหรับ Sensor นี้</p>;

  // ✅ ฟังก์ชันแปลง timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString("th-TH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

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
      formatter: (params) => {
        const index = params[0].dataIndex;
        const timestamp = formatTimestamp(temperatureData.readings[index]?.timestamp);
        return `
          <div style="text-align: center;">
            <strong>Temperature</strong><br/>
            Value: ${params[0].value}°C<br/>
            Timestamp: ${timestamp}
          </div>
        `;
      },
    },
    xAxis: {
      type: "category",
      data: temperatureData.readings.map((reading) => formatTimestamp(reading.timestamp)),
    },
    yAxis: {
      type: "value",
      name: "อุณหภูมิ (°C)",
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
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">อุณหภูมิจาก Sensor</h2>
      <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default TempChart;
