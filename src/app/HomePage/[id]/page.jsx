"use client";
import { useParams } from "next/navigation";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SensorDetail() {
  const { id } = useParams(); // ✅ ดึงค่า id จาก URL
  const { sensorData, loading, error } = useSensorStore();
  const [selectedParam, setSelectedParam] = useState<string | null>(null); // ✅ เก็บค่าพารามิเตอร์ที่ต้องการดู

  if (!id) return <p>⏳ กำลังโหลด...</p>;

  const sensor = sensorData[id];

  // ✅ ดึงข้อมูล Parameter ที่เลือกมาแสดง
  const selectedData = selectedParam
    ? [...sensor.environmental, ...sensor.gas].find((p) => p.param === selectedParam)?.readings || []
    : [];

  // ✅ ปรับการเรียงลำดับข้อมูลตามที่ร้องขอ: id, data, type, name, value, unit
  const formattedData = selectedData.map((d) => ({
    id: d.id,
    timestamp: new Date(d.timestamp).toLocaleTimeString(), // 🕒 แปลงเวลาให้อ่านง่าย
    type: d.type, // 🏷️ ประเภท
    name: d.param, // 📌 ชื่อพารามิเตอร์
    value: d.value, // 📊 ค่าที่อ่านได้
    unit: d.unit, // 🔢 หน่วย
  }));

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">ข้อมูล Sensor {id}</h1>

      {loading && <p>🔄 กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {sensor ? (
        <div>
          <h2 className="text-lg font-bold mb-2">เลือกข้อมูลที่ต้องการแสดง</h2>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {sensor.environmental.map((param) => (
              <button
                key={`env-${param.id_param}`}
                className={`px-4 py-2 rounded-lg ${
                  selectedParam === param.param ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setSelectedParam(param.param)}
              >
                🌍 {param.param}
              </button>
            ))}
            {sensor.gas.map((param) => (
              <button
                key={`gas-${param.id_param}`}
                className={`px-4 py-2 rounded-lg ${
                  selectedParam === param.param ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
                onClick={() => setSelectedParam(param.param)}
              >
                🔥 {param.param}
              </button>
            ))}
          </div>

          {/* ✅ แสดงข้อมูลเป็นตาราง */}
          {selectedParam && formattedData.length > 0 ? (
            <div className="mt-5">
              <h2 className="text-lg font-bold mb-2">รายละเอียดข้อมูล {selectedParam}</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="border border-gray-400 px-4 py-2">ID</th>
                      <th className="border border-gray-400 px-4 py-2">Data</th>
                      <th className="border border-gray-400 px-4 py-2">Type</th>
                      <th className="border border-gray-400 px-4 py-2">Name</th>
                      <th className="border border-gray-400 px-4 py-2">Value</th>
                      <th className="border border-gray-400 px-4 py-2">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedData.map((d) => (
                      <tr key={d.id} className="text-center">
                        <td className="border border-gray-400 px-4 py-2">{d.id}</td>
                        <td className="border border-gray-400 px-4 py-2">{d.timestamp}</td>
                        <td className="border border-gray-400 px-4 py-2">{d.type}</td>
                        <td className="border border-gray-400 px-4 py-2">{d.name}</td>
                        <td className="border border-gray-400 px-4 py-2">{d.value}</td>
                        <td className="border border-gray-400 px-4 py-2">{d.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ แสดงกราฟ */}
              <div className="mt-5">
                <h2 className="text-lg font-bold">กราฟ {selectedParam}</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-gray-500">🔽 กรุณาเลือกข้อมูลเพื่อแสดงกราฟ</p>
          )}
        </div>
      ) : (
        <p>❌ ไม่มีข้อมูล</p>
      )}
    </div>
  );
}
