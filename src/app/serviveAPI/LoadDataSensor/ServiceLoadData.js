// "use client";
// import { create } from "zustand";
// import axios from "axios";
// import ipconfig from "@/app/ipconfig";

// const API_URL = "https://${ipconfig.API_SENSOR}/auth/get-sensor-data-mapping";

// export const useSensorStore = create((set) => ({
//   sensorData: {}, // เก็บข้อมูล Sensor โดยจัดให้อยู่ในรูปแบบ { sensorId: { environmental, gas } }
//   loading: false,
//   error: null,

//   fetchSensorData: async (userId, companyId, accessToken) => {
//     try {
//       set({ loading: true, error: null });

//       const response = await axios.post(
//         API_URL,
//         { user_id: userId, company_id: companyId },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // ✅ ตรวจสอบข้อมูลก่อนใช้ `.map()`
//       const sensorMappings = response.data?.sensor_mappings ?? [];

//       const processedData = {};
//       sensorMappings.forEach((sensor) => {
//         const { sensor_id, environmental_params = {}, gas_parameters = {} } = sensor;

//         processedData[sensor_id] = {
//           environmental: Object.entries(environmental_params).map(([param, data]) => ({
//             param,
//             id_param: data?.id_param || "unknown", // ✅ ป้องกัน undefined
//             readings: data?.data?.map((d) => ({
//               id_data: d?.id_data || "unknown",
//               timestamp: d?.timestamp || "N/A",
//               unit: d?.unit || "-",
//               value: d?.value ?? 0, // ✅ ถ้า `value` เป็น `null` → ใช้ `0`
//             })) ?? [], // ✅ ถ้า `data?.data` ไม่มีค่า → ใช้ `[]`
//           })),
//           gas: Object.entries(gas_parameters).map(([param, data]) => ({
//             param,
//             id_param: data?.id_param || "unknown", // ✅ ป้องกัน undefined
//             readings: data?.data?.map((d) => ({
//               id_data: d?.id_data || "unknown",
//               timestamp: d?.timestamp || "N/A",
//               unit: d?.unit || "-",
//               value: d?.value ?? 0, // ✅ ถ้า `value` เป็น `null` → ใช้ `0`
//             })) ?? [], // ✅ ถ้า `data?.data` ไม่มีค่า → ใช้ `[]`
//           })),
//         };
//       });

//       set({ sensorData: processedData, loading: false });
//     } catch (error) {
//       console.error("❌ Error fetching sensor data:", error.message);
//       set({ error: error.message, loading: false });
//     }
//   },
// }));
// "use client";
// import { create } from "zustand";
// import axios from "axios";
// import ipconfig from "@/app/ipconfig";

// export const useSensorStore = create((set) => ({
//   sensorData: {}, // ✅ โครงสร้างข้อมูล Sensor
//   loading: false,
//   error: null,

//   fetchSensorData: async (userId, companyId, accessToken) => {
//     try {
//       set({ loading: true, error: null });

//       // ✅ ตรวจสอบว่า `ipconfig.API_SENSOR` ถูกต้องก่อน
//       if (!ipconfig.API_SENSOR) {
//         throw new Error("❌ API_SENSOR ไม่ถูกต้องใน ipconfig");
//       }

//       const API_URL = `https://${ipconfig.API_SENSOR}/auth/get-sensor-data-mapping`;

//       const response = await axios.post(
//         API_URL,
//         { user_id: userId, company_id: companyId },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // ✅ ป้องกันกรณี `sensor_mappings` เป็น `undefined` หรือ `null`
//       const sensorMappings = response.data?.sensor_mappings || [];

//       // ✅ จัดรูปแบบข้อมูล Sensor
//       const processedData = {};
//       sensorMappings.forEach((sensor) => {
//         const { sensor_id, environmental_params = {}, gas_parameters = {} } = sensor;

//         processedData[sensor_id] = {
//           environmental: Object.entries(environmental_params).map(([param, data]) => ({
//             param,
//             id_param: data?.id_param || "unknown",
//             readings: data?.data?.map((d) => ({
//               id_data: d?.id_data || "unknown",
//               timestamp: d?.timestamp || "N/A",
//               unit: d?.unit || "-",
//               value: d?.value ?? 0, // ✅ ป้องกัน `null`
//             })) ?? [],
//           })),
//           gas: Object.entries(gas_parameters).map(([param, data]) => ({
//             param,
//             id_param: data?.id_param || "unknown",
//             readings: data?.data?.map((d) => ({
//               id_data: d?.id_data || "unknown",
//               timestamp: d?.timestamp || "N/A",
//               unit: d?.unit || "-",
//               value: d?.value ?? 0, // ✅ ป้องกัน `null`
//             })) ?? [],
//           })),
//         };
//       });

//       set({ sensorData: processedData, loading: false });
//     } catch (error) {
//       console.error("❌ Error fetching sensor data:", error.response?.data || error.message);
//       set({ error: error.message, loading: false });
//     }
//   },
// }));
"use client";
import { create } from "zustand";
import axios from "axios";
import ipconfig from "@/app/ipconfig";

// ✅ ใช้ Template Literal แทน
const API_URL = `https://${ipconfig.API_SENSOR}/auth/get-sensor-data-mapping`;

export const useSensorStore = create((set) => ({
  sensorData: {},
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

      const sensorMappings = response.data?.sensor_mappings ?? [];

      const processedData = {};
      sensorMappings.forEach((sensor) => {
        const { sensor_id, environmental_params = {}, gas_parameters = {} } = sensor;

        processedData[sensor_id] = {
          environmental: Object.entries(environmental_params).map(([param, data]) => ({
            param,
            id_param: data?.id_param || "unknown",
            readings: data?.data?.map((d) => ({
              id_data: d?.id_data || "unknown",
              timestamp: d?.timestamp || "N/A",
              unit: d?.unit || "-",
              value: d?.value ?? 0,
            })) ?? [],
          })),
          gas: Object.entries(gas_parameters).map(([param, data]) => ({
            param,
            id_param: data?.id_param || "unknown",
            readings: data?.data?.map((d) => ({
              id_data: d?.id_data || "unknown",
              timestamp: d?.timestamp || "N/A",
              unit: d?.unit || "-",
              value: d?.value ?? 0,
            })) ?? [],
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
