"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";
import { FiRefreshCcw, FiCalendar } from "react-icons/fi";
import Swal from "sweetalert2";
import Select from "react-select";

const TempChart = lazy(() => import("../../components/Chart/TempChart"));
const WindChart = lazy(() => import("../../components/Chart/WindChart"));
const LineChartGas = lazy(() => import("../../components/Chart/LineChartCH2O"));
const HumidityChart = lazy(() => import("../../components/Chart/HumidityChart"));
const SensorMapAllMarkers = lazy(() => import("../../components/MapContent"));
const CustomDatepicker = lazy(() => import("../../components/DateRangePicker"));

const SpinnerFullPage = () => (
  <div className="flex justify-center items-center h-screen dark:bg-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

const HomePageTest = () => {
  const { isAuthenticated } = useAuth();
  const { sensorData, loading, connectWebSocket, disconnectWebSocket, loadSensorByDateRange, filteredSensorData, DateRange, filterSensorDataByDateRange } = useSensorStore();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  // ก่อน return
  const activeSensorData = DateRange?.startDate && DateRange?.endDate
    ? filteredSensorData[selectedSensor]
    : sensorData[selectedSensor]; // ยังไม่ได้เลือก → แสดงวันนี้



  const handleDateChange = (range) => {
    setDateRange(range);
    if (range.startDate && range.endDate) {
      filterSensorDataByDateRange(range); // ✅ ต้องมี!
    }
  };

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
      title: "กำลังรีเฟรชข้อมูล...",
      timer: 1000,
      showConfirmButton: false,
      willClose: () => {
        Swal.fire({
          title: "รีเฟรชข้อมูลสำเร็จ!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  };

  if (!isMounted || loading || !selectedSensor) return <SpinnerFullPage />;

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-white">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6 h-screen overflow-hidden overflow-y-auto dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">SENSOR DASHBOARD</h2>

        <div className="flex items-center gap-3 flex-wrap ">
          <div className="relative inline-block  right-0  z-[9999] flex-1 rounded-lg ">
            <CustomDatepicker onDateChange={handleDateChange} />
          </div>
          <Select
            options={Object.entries(sensorData).map(([sensorId, sensor]) => ({
              value: sensorId,
              label: sensor.sensor_name || sensorId,
            }))}
            value={{
              value: selectedSensor,
              label: sensorData[selectedSensor]?.sensor_name || selectedSensor,
            }}
            onChange={(e) => setSelectedSensor(e.value)}
            className="w-60"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: 'white',
                color: 'black',
                borderColor: state.isFocused ? '#007BFF' : '#ccc',
                boxShadow: state.isFocused ? '0 0 0 1px #007BFF' : 'none',
                '&:hover': { borderColor: '#007BFF' },
              }),
              singleValue: (base) => ({ ...base, color: 'black' }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? '#e0e0e0' : '#f0f0f0',
                color: 'black',
                cursor: 'pointer',
              }),
              menu: (base) => ({ ...base, backgroundColor: '#f0f0f0' }),
              input: (base) => ({ ...base, color: 'black' }),
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
      <div className="grid grid-cols-1 gap-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
          <Suspense fallback={<SpinnerFullPage />}>
            <SensorMapAllMarkers selectedSensor={selectedSensor} />
          </Suspense>

          <Suspense fallback={<SpinnerFullPage />}>
            <TempChart sensorData={{ id: selectedSensor, ...activeSensorData }} dateRange={dateRange} />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<SpinnerFullPage />}>
            <WindChart sensorData={sensorData} selectedSensor={selectedSensor} />
          </Suspense>

          <Suspense fallback={<SpinnerFullPage />}>
            <HumidityChart sensorData={{ ...sensorData[selectedSensor], sensor_name: sensorData[selectedSensor]?.sensor_name }} />
          </Suspense>
        </div>
      </div>

      <div className="shadow-xl">
        <Suspense fallback={<SpinnerFullPage />}>
          <LineChartGas
            gasData={sensorData[selectedSensor].gas?.filter(g => g.readings && g.readings.some(r => r.value !== null)) || []}
            selectedSensor={selectedSensor}
            sensorName={sensorData[selectedSensor]?.sensor_name}
            dateRange={dateRange} // ✅ เพิ่มตรงนี้!
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePageTest;
