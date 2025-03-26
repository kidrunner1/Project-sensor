"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";
import { FiRefreshCcw } from "react-icons/fi";
import Swal from "sweetalert2";
import Select from "react-select";

const TempChart = lazy(() => import("../../components/TempChart"));
const WindChart = lazy(() => import("../../components/WindChart"));
const LineChartGas = lazy(() => import("../../components/LineChartCH2O"));

const SkeletonChart = () => <div className="animate-pulse bg-gray-700 h-full w-full rounded-md"></div>;
const FullPageSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    <SkeletonChart />
    <SkeletonChart />
  </div>
);

const HomePageTest = () => {
  const { isAuthenticated } = useAuth();
  const { sensorData, loading, error, connectWebSocket, disconnectWebSocket } = useSensorStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingSensor, setIsLoadingSensor] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const userId = sessionStorage.getItem("user_id");
    const companyId = sessionStorage.getItem("company_id");
    const accessToken = sessionStorage.getItem("access_token");

    if (userId && companyId && accessToken) {
      connectWebSocket(userId, companyId, accessToken);
    }

    return () => disconnectWebSocket();
  }, []);

  useEffect(() => {
    if (Object.keys(sensorData).length > 0 && !selectedSensor) {
      setSelectedSensor(Object.keys(sensorData)[0]);
    }
  }, [sensorData]);

  const handleRefresh = () => {
    Swal.fire({
      title: "กำลังโหลดข้อมูลใหม่...",
      timer: 1000,
      showConfirmButton: false,
      willClose: () => {
        Swal.fire({
          title: "รีเฟรชสำเร็จ!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  };

  if (!isMounted) return <FullPageSkeleton />;

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-white">
        🔄 กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6 h-screen overflow-hidden overflow-y-auto dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">SENSOR DASHBOARD</h2>

        <div className="flex items-center gap-3">
          <Select
            options={Object.keys(sensorData).map((sensorId) => ({
              value: sensorId,
              label: sensorId,
            }))}
            value={{ value: selectedSensor, label: selectedSensor }}
            onChange={(e) => setSelectedSensor(e.value)}
            className="w-48"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: 'white',
                color: 'black',
                borderColor: state.isFocused ? '#007BFF' : '#ccc',
                boxShadow: state.isFocused ? '0 0 0 1px #007BFF' : 'none',
                '&:hover': {
                  borderColor: '#007BFF',
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: 'black', // ✅ สีข้อความที่เลือก
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? '#e0e0e0' : '#f0f0f0',
                color: 'black', // ✅ สีข้อความใน dropdown
                cursor: 'pointer',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#f0f0f0',
              }),
              input: (base) => ({
                ...base,
                color: 'black', // ✅ ตอนพิมพ์ค้นหา
              }),
            }}
          />


          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <FiRefreshCcw className="text-lg" />
            รีเฟรช
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Suspense fallback={<SkeletonChart />}>
          {loading || !selectedSensor ? (
            <SkeletonChart />
          ) : (
            <TempChart sensorData={{ id: selectedSensor, ...sensorData[selectedSensor] }} />
          )}
        </Suspense>

        <div className="flex flex-col gap-4 h-full ">

          <Suspense fallback={<SkeletonChart />}>
            {loading || !selectedSensor ? (
              <SkeletonChart />
            ) : (
              <WindChart sensorData={sensorData} selectedSensor={selectedSensor} />
            )}
          </Suspense>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex justify-center items-center h-[200px]">
            <p className="text-gray-700 dark:text-gray-300">เพิ่ม Component อื่น ๆ ตรงนี้</p>
          </div>
        </div>
      </div>

      {/* Gas Chart */}
      <div className="shadow-xl">
        <Suspense fallback={<SkeletonChart />}>
          {loading || isLoadingSensor || !selectedSensor ? (
            <SkeletonChart />
          ) : sensorData[selectedSensor] && Array.isArray(sensorData[selectedSensor].gas) ? (
            (() => {
              const validGasData = sensorData[selectedSensor].gas.filter(
                (gas) => gas.readings && gas.readings.some((reading) => reading.value !== null)
              );

              return validGasData.length > 0 ? (
                <LineChartGas gasData={validGasData} selectedSensor={selectedSensor} />
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">❌ ไม่มีข้อมูลก๊าซที่พร้อมใช้งาน</p>
              );
            })()
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">❌ ไม่มีข้อมูลก๊าซ</p>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default HomePageTest;
