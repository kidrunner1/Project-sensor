"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";
import { FiRefreshCcw } from "react-icons/fi";
import Swal from "sweetalert2";
import Select from "react-select";

// ✅ Lazy Load Components
const TempChart = lazy(() => import("../../components/TempChart"));
const WindChart = lazy(() => import("../../components/WindChart"));
const LineChartGas = lazy(() => import("../../components/LineChartCH2O"));

// ✅ UI Skeleton Components
const SkeletonChart = () => <div className="animate-pulse bg-gray-700 h-full w-full rounded-md"></div>;
const FullPageSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    <SkeletonChart />
    <SkeletonChart />
  </div>
);

const HomePageTest = () => {
  const { isAuthenticated } = useAuth();
  const { sensorData, loading, error, fetchSensorData } = useSensorStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingSensor, setIsLoadingSensor] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState("");

  useEffect(() => {
    setIsMounted(true);

    const userId = sessionStorage.getItem("user_id");
    const companyId = sessionStorage.getItem("company_id");
    const accessToken = sessionStorage.getItem("access_token");

    if (userId && companyId && accessToken) {
      fetchSensorData(userId, companyId, accessToken);
    }
  }, [fetchSensorData]);

  useEffect(() => {
    if (Object.keys(sensorData).length > 0 && !selectedSensor) {
      setSelectedSensor(Object.keys(sensorData)[0]);
    }
  }, [sensorData]);

  // ✅ ฟังก์ชันรีเฟรชข้อมูล
  const handleRefresh = () => {
    setIsLoadingSensor(true);
    const userId = sessionStorage.getItem("user_id");
    const companyId = sessionStorage.getItem("company_id");
    const accessToken = sessionStorage.getItem("access_token");

    if (userId && companyId && accessToken) {
      fetchSensorData(userId, companyId, accessToken);
    }

    setTimeout(() => {
      setIsLoadingSensor(false);
      Swal.fire({
        title: "รีเฟรชข้อมูลสำเร็จ!",
        text: "ข้อมูล Sensor ได้รับการอัปเดตแล้ว",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }, 2000);
  };

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
      {/* ✅ Header: Dashboard & Refresh */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">SENSOR DASHBOARD</h2>

        <div className="flex items-center gap-3">
          {/* ✅ Dropdown Sensor (ใช้ react-select เพื่อให้ค้นหาได้) */}
          <Select
            options={Object.keys(sensorData).map((sensorId) => ({
              value: sensorId,
              label: sensorId,
            }))}
            value={{ value: selectedSensor, label: selectedSensor }}
            onChange={(e) => setSelectedSensor(e.value)}
            className="w-48"
          />

          {/* ✅ ปุ่ม Refresh */}
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <FiRefreshCcw className="text-lg" />
            รีเฟรช
          </button>
        </div>
      </div>

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* ซ้าย: Temp Chart */}
        <Suspense fallback={<SkeletonChart />}>
          {loading || !selectedSensor ? (
            <SkeletonChart />
          ) : (
            <TempChart
              sensorData={{ id: selectedSensor, ...sensorData[selectedSensor] }}
            />
          )}
        </Suspense>

        {/* ขวา: แบ่ง 2 ชั้น */}
        <div className="flex flex-col gap-4 h-full">
          {/* บน: WindChart */}
          <Suspense fallback={<SkeletonChart />}>
            {loading || !selectedSensor ? (
              <SkeletonChart />
            ) : (
              <WindChart
                sensorData={sensorData}
                selectedSensor={selectedSensor}
              />
            )}
          </Suspense>

          {/* ล่าง: อื่นๆ เช่น ตารางหรือกราฟเพิ่มเติม */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex justify-center items-center h-[200px]">
            <p className="text-gray-700 dark:text-gray-300">เพิ่ม Component อื่น ๆ ตรงนี้</p>
          </div>
        </div>
      </div>


      {/* ✅ Gas Chart */}
      <div className="shadow-xl">
        <Suspense fallback={<SkeletonChart />}>
          {loading || isLoadingSensor || !selectedSensor ? (
            <SkeletonChart />
          ) : sensorData[selectedSensor] && Array.isArray(sensorData[selectedSensor].gas) ? (
            (() => {
              // ✅ กรองเฉพาะก๊าซที่มี readings และ value จริงๆ
              const validGasData = sensorData[selectedSensor].gas.filter(
                (gas) => gas.readings && gas.readings.some((reading) => reading.value !== null)
              );

              return validGasData.length > 0 ? (
                <LineChartGas gasData={validGasData} selectedSensor={selectedSensor} />
              ) : (
                <p className="text-center text-gray-500">❌ ไม่มีข้อมูลก๊าซที่พร้อมใช้งาน</p>
              );
            })()
          ) : (
            <p className="text-center text-gray-500">❌ ไม่มีข้อมูลก๊าซ</p>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default HomePageTest;
