"use client";

import { motion } from "framer-motion";
import SensorMap from "@/app/components/MapContent";
import {
  FaCloudSunRain,
  FaWind,
  FaSun,
  FaCloud,
  FaThermometerHalf,
} from "react-icons/fa";
import "mapbox-gl/dist/mapbox-gl.css";

const weatherHighlights = [
  { icon: <FaWind className="text-blue-400 text-2xl" />, label: "ความเร็วลม", value: "3.4 m/s" },
  { icon: <FaThermometerHalf className="text-red-500 text-2xl" />, label: "อุณหภูมิ", value: "30°C" },
  { icon: <FaCloud className="text-gray-300 text-2xl" />, label: "ความชื้น", value: "75%" },
];

export default function HomePage() {
  return (
    <div className="p-6 flex flex-col gap-6 h-screen overflow-hidden overflow-y-auto">
      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">🌎 Dashboard</h2>

      {/* Layout Grid */}
      <div className="grid md:grid-cols-3 gap-6">

        {/*  Left Panel - Sensor Map */}
        <motion.div
          className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📍 ตำแหน่งเซ็นเซอร์</h3>
          <SensorMap
            sensorLocations={[
              { name: "เซ็นเซอร์ 1", lat: 13.7563, lng: 100.5018, gasValue: 0.05 },
              { name: "เซ็นเซอร์ 2", lat: 14.0200, lng: 100.5000, gasValue: 0.08 },
            ]}
          />
        </motion.div>
      </div>
    </div>
  );
}