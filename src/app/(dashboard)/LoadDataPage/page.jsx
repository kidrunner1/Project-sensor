"use client";
import { useEffect, useRef, useState } from "react";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";

export default function Dashboard() {
  const {
    sensorData,
    loading,
    error,
    connectWebSocket,
    disconnectWebSocket,
  } = useSensorStore();

  const [selectedSensor, setSelectedSensor] = useState("");
  const [isLoadingSensor, setIsLoadingSensor] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(new Date().toISOString());
  const baseTimestampRef = useRef(null);
  const startClientTimeRef = useRef(null);
  const [fakeClock, setFakeClock] = useState(new Date());

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
    if (!selectedSensor || !sensorData[selectedSensor]) return;

    const readings = sensorData[selectedSensor]?.environmental || [];
    const latest = readings.flatMap((r) => r.readings || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const lastReading = latest[0];

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
  }, [selectedSensor, sensorData]);

  useEffect(() => {
    const newAccessToken = sessionStorage.getItem("access_token");
    const newUserId = sessionStorage.getItem("user_id");
    const newCompanyId = sessionStorage.getItem("company_id");

    if (newAccessToken && newUserId && newCompanyId) {
      // ✅ ใช้ Store function แทนการสร้าง WebSocket ใหม่
      connectWebSocket(newUserId, newCompanyId, newAccessToken);
    }

    return () => {
      // ✅ Cleanup → Disconnect WebSocket
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSensorChange = (e) => {
    setIsLoadingSensor(true);
    const newSensor = e.target.value;
    setTimeout(() => {
      setSelectedSensor(newSensor);
      setIsLoadingSensor(false);
    }, 500);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "ไม่มีข้อมูล";
    return new Date(timestamp).toLocaleString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">SENSOR REPORT</h1>

      {loading && <p>🔄 กำลังโหลดข้อมูล Sensor...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      <div className="mt-4">
        <label className="text-gray-700 font-semibold">เลือก Sensor:</label>
        <select
          value={selectedSensor}
          onChange={handleSensorChange}
          className="block w-full mt-2 p-2 border rounded-md"
          disabled={isLoadingSensor}
        >
          <option value="">🔽 กรุณาเลือก Sensor</option>
          {Object.keys(sensorData).map((sensorId) => (
            <option key={sensorId} value={sensorId}>
              {sensorId}
            </option>
          ))}
        </select>
      </div>

      {isLoadingSensor ? (
        <div className="flex justify-center items-center mt-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-2 text-blue-500">กำลังโหลดข้อมูล Sensor...</p>
        </div>
      ) : (
        selectedSensor &&
        sensorData[selectedSensor] && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold">ข้อมูล Sensor: {selectedSensor}</h2>

            {/* ✅ Environmental Parameters */}
            <h3 className="mt-3 text-md font-semibold text-gray-700">Environmental Parameters</h3>
            <table className="w-full mt-2 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID Data</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Value</th>
                  <th className="border p-2">Unit</th>
                  <th className="border p-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {sensorData[selectedSensor].environmental
                  .map((param) => {
                    const validReadings = param.readings
                      .filter((reading) => reading.value !== null && reading.timestamp)
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    if (validReadings.length === 0) return null;

                    const lastReading = validReadings[0];

                    return (
                      <tr key={`env-${param.id_param}`} className="text-center">
                        <td className="border p-2">{param.id_param}</td>
                        <td className="border p-2">Environmental</td>
                        <td className="border p-2">{param.param}</td>
                        <td className="border p-2">{parseFloat(lastReading.value).toFixed(2)}</td>
                        <td className="border p-2">{lastReading.unit || ""}</td>
                        <td className="border p-2">{formatTimestamp(fakeClock)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {/* ✅ Gas Parameters */}
            <h3 className="mt-3 text-md font-semibold text-gray-700">Gas Parameters</h3>
            <table className="w-full mt-2 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">ID Data</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Value</th>
                  <th className="border p-2">Unit</th>
                  <th className="border p-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {sensorData[selectedSensor].gas
                  .map((param) => {
                    const validReadings = param.readings
                      .filter((reading) => reading.value !== null && reading.timestamp)
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    if (validReadings.length === 0) return null;

                    const lastReading = validReadings[0];

                    return (
                      <tr key={`gas-${param.id_param}`} className="text-center">
                        <td className="border p-2">{param.id_param}</td>
                        <td className="border p-2">Gas</td>
                        <td className="border p-2">{param.param}</td>
                        <td className="border p-2">{parseFloat(lastReading.value).toFixed(2)}</td>
                        <td className="border p-2">{lastReading.unit || ""}</td>
                        <td className="border p-2">{formatTimestamp(fakeClock)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
