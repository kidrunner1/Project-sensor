"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";

export default function Dashboard() {
  const {
    sensorData,
    loading,
    error,
    // connectWebSocket,
    connectWebSocketNoAuth,
    disconnectWebSocket,
  } = useSensorStore();
  const [parameterFilter, setParameterFilter] = useState("all");
  const [selectedSensor, setSelectedSensor] = useState("");
  const [isLoadingSensor, setIsLoadingSensor] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(new Date().toISOString());
  const baseTimestampRef = useRef(null);
  const startClientTimeRef = useRef(null);
  const [fakeClock, setFakeClock] = useState(new Date());
  const [dataTypeFilter, setDataTypeFilter] = useState("all"); // all | environmental | gas
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  const allParams = useMemo(() => {
    const selected = sensorData[selectedSensor];
    if (!selected) return [];

    const environmentalParams = selected.environmental?.map((e) => e.param) || [];
    const gasParams = selected.gas?.map((g) => g.param) || [];
    const all = [...new Set([...environmentalParams, ...gasParams])];
    return all;
  }, [sensorData, selectedSensor]);

  // กำหนดค่าเริ่มต้นสำหรับการแสดงผลข้อมูล
  // Step 1: รวมข้อมูลพร้อม flag type
  const rawReadings = [
    ...(dataTypeFilter === "gas" || dataTypeFilter === "all"
      ? sensorData[selectedSensor]?.gas.map((param) => ({
        ...param,
        param_type: "Gas",
      })) || []
      : []),
    ...(dataTypeFilter === "environmental" || dataTypeFilter === "all"
      ? sensorData[selectedSensor]?.environmental.map((param) => ({
        ...param,
        param_type: "Environmental",
      })) || []
      : []),
  ]
    .filter((param) => parameterFilter === "all" || param.param === parameterFilter) // ✅ กรอง param ตาม filter
    .flatMap((param) =>
      (param.readings || [])
        .filter((reading) => reading.value !== null && reading.timestamp)
        .map((reading) => ({
          ...reading,
          id_param: param.id_param,
          name: param.param,
          type: param.param_type,
        }))
    );


  // Step 2: Group by `name` และ sort ในกลุ่ม
  const groupedByName = rawReadings.reduce((acc, reading) => {
    if (!acc[reading.name]) acc[reading.name] = [];
    acc[reading.name].push(reading);
    return acc;
  }, {});

  // Step 3: เรียงในกลุ่มตาม timestamp
  const sortedGrouped = Object.entries(groupedByName)
    .sort(([a], [b]) => a.localeCompare(b)) // sort ตามชื่อ param
    .flatMap(([_, group]) =>
      group.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    );

  // Step 4: Pagination
  const totalPages = Math.ceil(sortedGrouped.length / rowsPerPage);
  const paginatedReadings = sortedGrouped.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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

  // useEffect(() => {
  //   const newAccessToken = sessionStorage.getItem("access_token");
  //   const newUserId = sessionStorage.getItem("user_id");
  //   const newCompanyId = sessionStorage.getItem("company_id");

  //   if (newAccessToken && newUserId && newCompanyId) {
  //     // ✅ ใช้ Store function แทนการสร้าง WebSocket ใหม่
  //     connectWebSocket(newUserId, newCompanyId, newAccessToken);
  //   }

  //   return () => {
  //     // ✅ Cleanup → Disconnect WebSocket
  //     disconnectWebSocket();
  //   };
  // }, []);

  useEffect(() => {
    const newCompanyId = sessionStorage.getItem("company_id"); // ✅ ไม่ต้องดึง access_token / user_id แล้ว

    if (newCompanyId) {
      connectWebSocketNoAuth(newCompanyId); // ✅ ใช้ connectWebSocketNoAuth
    }

    return () => {
      disconnectWebSocket(); // ✅ ปิด WebSocket ตอน unmount
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

      {loading && <p className="text-3xl font-bold text-gray-800 dark:text-white"> กำลังโหลดข้อมูล Sensor...</p>}
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
          <option value="">กรุณาเลือก Sensor</option>
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

      {/* ALL DATA 100 ROW */}
      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-500">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          ข้อมูล SENSOR : {sensorData[selectedSensor]?.sensor_name || selectedSensor}
        </h2>
        <div className="flex items-center gap-2 mt-4">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">เลือกประเภทข้อมูล : </label>
          <select
            value={dataTypeFilter}
            onChange={(e) => {
              setDataTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 rounded-md border text-gray-800 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">ทั้งหมด</option>
            <option value="environmental">Environmental</option>
            <option value="gas">Gas</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">เลือก Parameter : </label>
          <select
            value={parameterFilter}
            onChange={(e) => {
              setParameterFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 rounded-md border text-gray-800 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">ทั้งหมด</option>
            {allParams.map((param) => (
              <option key={param} value={param}>
                {param}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full mt-4 border-collapse border border-gray-300 dark:border-gray-600 text-sm">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              {/* <th className="border p-2 text-gray-800 dark:text-white">ID Data</th> */}
              <th className="border p-2 text-gray-800 dark:text-white">Type</th>
              <th className="border p-2 text-gray-800 dark:text-white">Name</th>
              <th className="border p-2 text-gray-800 dark:text-white">Value</th>
              <th className="border p-2 text-gray-800 dark:text-white">Unit</th>
              <th className="border p-2 text-gray-800 dark:text-white">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReadings.map((r, index) => (
              <tr key={`all-${r.id_param}-${index}`} className="text-center">

                <td className="border p-2 text-gray-800 dark:text-white">{r.type}</td>
                <td className="border p-2 text-gray-800 dark:text-white">{r.name}</td>
                <td className="border p-2 text-gray-800 dark:text-white">{parseFloat(r.value).toFixed(2)}</td>
                <td className="border p-2 text-gray-800 dark:text-white">{r.unit || ""}</td>
                <td className="border p-2 text-gray-800 dark:text-white">{formatTimestamp(r.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50 dark:bg-white dark:text-gray-800"
          >
            ก่อนหน้า
          </button>
          <span className="text-gray-800 dark:text-white font-medium">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50 dark:bg-white dark:text-gray-800"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
