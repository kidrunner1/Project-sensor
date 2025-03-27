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
    <div className="p-4 flex flex-col gap-6 h-screen overflow-hidden overflow-y-auto dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SENSOR REPORT</h1>

      {loading && <p className="text-3xl font-bold text-gray-800 dark:text-white">🔄 กำลังโหลดข้อมูล Sensor...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      <div className="mt-4">
        <label className="text-gray-700 dark:text-gray-300 font-semibold">เลือก SENSOR :</label>
        <select
          value={selectedSensor}
          onChange={handleSensorChange}
          className="block w-full mt-2 p-2 border rounded-md 
             bg-white text-gray-800 
             dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={isLoadingSensor}
        >
          <option value="">🔽 กรุณาเลือก Sensor</option>
          {Object.keys(sensorData).map((sensorId) => (
            <option key={sensorId} value={sensorId}>
              {sensorData[sensorId]?.sensor_name || sensorId}
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
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-500">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              ข้อมูล SENSOR : {sensorData[selectedSensor]?.sensor_name || selectedSensor}
            </h2>


            {/* Environmental Parameters */}
            <h3 className="mt-3 text-md font-semibold text-gray-700 dark:text-gray-200">
              Environmental Parameters
            </h3>
            <table className="w-full mt-2 border-collapse border border-gray-300 dark:border-gray-600 text-sm">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border p-2 text-gray-800 dark:text-white">ID Data</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Type</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Name</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Value</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Unit</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {sensorData[selectedSensor].environmental.map((param) => {
                  const validReadings = param.readings
                    .filter((reading) => reading.value !== null && reading.timestamp)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                  if (validReadings.length === 0) return null;
                  const lastReading = validReadings[0];

                  return (
                    <tr key={`env-${param.id_param}`} className="text-center">
                      <td className="border p-2 text-gray-800 dark:text-white">{param.id_param}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">Environmental</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{param.param}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{parseFloat(lastReading.value).toFixed(2)}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{lastReading.unit || ""}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{formatTimestamp(fakeClock)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Gas Parameters */}
            <h3 className="mt-3 text-md font-semibold text-gray-700 dark:text-gray-200">
              Gas Parameters
            </h3>
            <table className="w-full mt-2 border-collapse border border-gray-300 dark:border-gray-600 text-sm">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border p-2 text-gray-800 dark:text-white">ID Data</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Type</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Name</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Value</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Unit</th>
                  <th className="border p-2 text-gray-800 dark:text-white">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {sensorData[selectedSensor].gas.map((param) => {
                  const validReadings = param.readings
                    .filter((reading) => reading.value !== null && reading.timestamp)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                  if (validReadings.length === 0) return null;
                  const lastReading = validReadings[0];

                  return (
                    <tr key={`gas-${param.id_param}`} className="text-center">
                      <td className="border p-2 text-gray-800 dark:text-white">{param.id_param}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">Gas</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{param.param}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{parseFloat(lastReading.value).toFixed(2)}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{lastReading.unit || ""}</td>
                      <td className="border p-2 text-gray-800 dark:text-white">{formatTimestamp(fakeClock)}</td>
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
