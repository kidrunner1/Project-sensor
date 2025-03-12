"use client";
import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8289/auth/get-sensor-data-mapping";

export const useSensorStore = create((set) => ({
  sensorData: {}, // เก็บข้อมูล Sensor โดยจัดให้อยู่ในรูปแบบ { sensorId: { environmental, gas } }
  loading: false,
  error: null,

  fetchSensorData: async (userId, companyId, accessToken) => {
    try {
      set({ loading: true, error: null });

      const response = await axios.post(
        API_URL,
        { user_id: userId, company_id: companyId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ ตรวจสอบข้อมูลก่อนใช้ `.map()`
      const sensorMappings = response.data?.sensor_mappings ?? [];

      const processedData = {};
      sensorMappings.forEach((sensor) => {
        const { sensor_id, environmental_params = {}, gas_parameters = {} } = sensor;

        processedData[sensor_id] = {
          environmental: Object.entries(environmental_params).map(([param, data]) => ({
            param,
            id_param: data?.id_param || "unknown", // ✅ ป้องกัน undefined
            readings: data?.data?.map((d) => ({
              id_data: d?.id_data || "unknown",
              timestamp: d?.timestamp || "N/A",
              unit: d?.unit || "-",
              value: d?.value ?? 0, // ✅ ถ้า `value` เป็น `null` → ใช้ `0`
            })) ?? [], // ✅ ถ้า `data?.data` ไม่มีค่า → ใช้ `[]`
          })),
          gas: Object.entries(gas_parameters).map(([param, data]) => ({
            param,
            id_param: data?.id_param || "unknown", // ✅ ป้องกัน undefined
            readings: data?.data?.map((d) => ({
              id_data: d?.id_data || "unknown",
              timestamp: d?.timestamp || "N/A",
              unit: d?.unit || "-",
              value: d?.value ?? 0, // ✅ ถ้า `value` เป็น `null` → ใช้ `0`
            })) ?? [], // ✅ ถ้า `data?.data` ไม่มีค่า → ใช้ `[]`
          })),
        };
      });

      set({ sensorData: processedData, loading: false });
    } catch (error) {
      console.error("❌ Error fetching sensor data:", error.message);
      set({ error: error.message, loading: false });
    }
  },
}));
