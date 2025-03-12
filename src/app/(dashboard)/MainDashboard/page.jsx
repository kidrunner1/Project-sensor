"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";

// ✅ Lazy Load Components
const TempChart = lazy(() => import("../../components/TempChart"));
const WindChart = lazy(() => import("../../components/WindChart"));
const LineChartGas = lazy(() => import("../../components/LineChartCH2O"));
const LineChartOzone = lazy(() => import("../../components/LineChartOzone"));

const HomePageTest = () => {
  const { isAuthenticated } = useAuth();
  const { sensorData, loading, error, fetchSensorData } = useSensorStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingSensor, setIsLoadingSensor] = useState(false); // ✅ สถานะโหลดข้อมูล Sensor
  const [selectedSensor, setSelectedSensor] = useState(""); // ✅ ตัวเลือก Sensor ที่เลือก

  useEffect(() => {
    setIsMounted(true);

    // ✅ ดึง user_id และ company_id จาก sessionStorage
    const userId = sessionStorage.getItem("user_id");
    const companyId = sessionStorage.getItem("company_id");
    const accessToken = sessionStorage.getItem("access_token");

    if (userId && companyId && accessToken) {
      fetchSensorData(userId, companyId, accessToken);
    }
  }, [fetchSensorData]);

  useEffect(() => {
    // ✅ ตั้งค่า Default Sensor ตัวแรก
    if (Object.keys(sensorData).length > 0 && !selectedSensor) {
      setSelectedSensor(Object.keys(sensorData)[0]);
    }
  }, [sensorData]);

  if (!isMounted) {
    return <FullPageSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        🔄 กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6 h-screen overflow-hidden overflow-y-auto">
      {/* ✅ แถบบนสุด: Dashboard + Dropdown */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Dashboard</h2>

        {/* ✅ Dropdown Sensor - ขยับไปด้านขวา */}
        <div className="relative">
          <label className="block text-gray-700 font-semibold text-right">เลือก Sensor:</label>
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="w-48 p-2 border rounded-md bg-white shadow-lg hover:cursor-pointer"
          >
            {Object.keys(sensorData).map((sensorId) => (
              <option key={sensorId} value={sensorId}>
                {sensorId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Temperature Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="min-h-[300px] h-auto w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Suspense fallback={<SkeletonChart />}>
            {loading || !selectedSensor ? <SkeletonChart /> : (
              <TempChart sensorData={{ id: selectedSensor, ...sensorData[selectedSensor] }} />
            )}
          </Suspense>
        </div>

        {/* ✅ Attendance Chart */}
        <div className="min-h-[300px] h-auto w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Suspense fallback={<SkeletonChart />}>
            {loading || !selectedSensor ? (
              <SkeletonChart />
            ) : (
              <WindChart sensorData={sensorData} selectedSensor={selectedSensor} />
            )}
          </Suspense>
        </div>

      </div>

      {/* ✅ Pollution Charts Section */}
      <div className="grid gap-4 w-full">
        {/* ✅ Ozone Chart */}
        {/* <div className="min-h-[500px] h-auto w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Suspense fallback={<SkeletonChart />}>
            {loading || !selectedSensor ? <SkeletonChart /> : <LineChartOzone sensorData={sensorData[selectedSensor]} />}
          </Suspense>
        </div> */}

        {/* ✅ Formaldehyde Chart */}
        <div className="min-h-[500px] h-auto w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Suspense fallback={<SkeletonChart />}>
            {loading || isLoadingSensor || !selectedSensor ? (
              <SkeletonChart />
            ) : sensorData[selectedSensor] && sensorData[selectedSensor].gas.length > 0 ? (
              (() => {
                // ✅ กรองเฉพาะก๊าซที่มี readings จริง ๆ
                const validGasData = sensorData[selectedSensor].gas.filter((gas) => gas.readings.length > 0);
                return validGasData.length > 0 ? (
                  <LineChartGas gasData={validGasData} selectedSensor={selectedSensor} />
                ) : (
                  <p className="text-center text-gray-500">❌ ไม่มีข้อมูลก๊าซที่มี readings</p>
                );
              })()
            ) : (
              <p className="text-center text-gray-500">❌ ไม่มีข้อมูลก๊าซ</p>
            )}
          </Suspense>

        </div>
      </div>
    </div>
  );
};

// ✅ Skeleton UI
const SkeletonChart = () => <div className="animate-pulse bg-gray-700 h-full w-full rounded-md"></div>;
const FullPageSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    <SkeletonChart />
    <SkeletonChart />
  </div>
);

export default HomePageTest;
