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
import WindDirectionChart from "@/app/components/WindDirectionChart";

const weatherHighlights = [
  { icon: <FaWind className="text-blue-400 text-2xl" />, label: "ความเร็วลม", value: "3.4 m/s" },
  { icon: <FaThermometerHalf className="text-red-500 text-2xl" />, label: "อุณหภูมิ", value: "30°C" },
  { icon: <FaCloud className="text-gray-300 text-2xl" />, label: "ความชื้น", value: "75%" },
];

export default function HomePage() {
  return (
    <div className="p-6 flex flex-col gap-6 h-screen overflow-hidden overflow-y-auto">
      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">HOMEPAGE</h2>

      {/* Layout Grid */}
      <div className="grid md:grid-cols-3 gap-6">
      </div>
    </div>
  );
}