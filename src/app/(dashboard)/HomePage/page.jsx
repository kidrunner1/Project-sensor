"use client";

import { FiSearch } from "react-icons/fi";
import { FaCloudSunRain, FaWind, FaSun, FaCloud, FaThermometerHalf } from "react-icons/fa";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import WeatherCard from "@/app/components/WeatherCard";
import "mapbox-gl/dist/mapbox-gl.css";

const weatherData = [
  { time: "1AM", value: 5 },
  { time: "4AM", value: 8 },
  { time: "7AM", value: 12 },
  { time: "10AM", value: 15 },
  { time: "1PM", value: 18 },
  { time: "4PM", value: 14 },
  { time: "7PM", value: 9 },
];

export default function HomePage() {
  return (
    <div className="p-4 flex gap-4 flex-col h-screen overflow-hidden overflow-y-auto">
      {/* Grid Layout */}
      <h2 className="text-3xl font-bold  md:text-left">Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Panel */}

        <div className="flex justify-between">
          <div>
            <WeatherCard />
          </div>

        </div>


        {/* Middle Panel - Highlights */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-lg col-span-2"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-4">Today's Highlights</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Wind Status</p>
              <h3 className="text-2xl font-bold">7.90 km/h</h3>
              <FaWind className="text-blue-300 text-4xl mt-2" />
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={weatherData}>
                  <Line type="monotone" dataKey="value" stroke="#38bdf8" />
                  <XAxis dataKey="time" tick={false} />
                  <YAxis hide />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">UV Index</p>
              <h3 className="text-2xl font-bold">5.50</h3>
              <FaSun className="text-yellow-300 text-4xl mt-2" />
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Sunrise & Sunset</p>
              <h3 className="text-lg font-bold">5:50 AM / 6:30 PM</h3>
              <FaCloud className="text-orange-400 text-4xl mt-2" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* 7 Days Forecast */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-bold mb-4">7 Days Forecast</h2>
          <div className="space-y-3">
            {["Tue", "Wed", "Thu", "Fri"].map((day, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                <span>{day}</span>
                <FaCloudSunRain className="text-yellow-300 text-2xl" />
                <span>+{Math.floor(Math.random() * 10) + 20}°C</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
