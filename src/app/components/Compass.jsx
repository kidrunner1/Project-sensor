"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const getDirection = (angle) => {
  if ((angle >= 337.5 && angle <= 360) || (angle >= 0 && angle < 22.5))
    return "N";
  if (angle >= 22.5 && angle < 67.5) return "NE";
  if (angle >= 67.5 && angle < 112.5) return "E";
  if (angle >= 112.5 && angle < 157.5) return "SE";
  if (angle >= 157.5 && angle < 202.5) return "S";
  if (angle >= 202.5 && angle < 247.5) return "SW";
  if (angle >= 247.5 && angle < 292.5) return "W";
  if (angle >= 292.5 && angle < 337.5) return "NW";
  return "Unknown";
};

const Compass = () => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 10) % 360);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl w-full h-full p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-xl font-bold">ทิศทาง</h1>
        <Image src="/images/more.png" alt="More" width={24} height={24} />
      </div>

      {/* Compass */}
      <div className="relative w-64 h-64 bg-gray-100 rounded-full border-4 border-gray-300 shadow-lg flex items-center justify-center">
        {/* Compass Labels */}
        {["N", "E", "S", "W"].map((dir, idx) => (
          <div
            key={dir}
            className="absolute text-lg font-bold text-gray-700"
            style={{
              transform: `rotate(${idx * 90}deg) translate(0, -90px) rotate(-${idx * 90}deg)`,
              top: "50%",
              left: "50%",
              transformOrigin: "center",
            }}
          >
            {dir}
          </div>
        ))}

        {/* Arrow Needle */}
        <div
          className="absolute w-2 h-24 bg-red-500 rounded-t-lg transform origin-bottom"
          style={{ transform: `rotate(${angle}deg)` }}
        />

        {/* Compass Center */}
        <div className="absolute w-8 h-8 bg-black rounded-full border-2 border-white"></div>
      </div>

      {/* Angle Display */}
      <p className="mt-6 text-lg font-semibold">
        Current Angle: {angle}° ({getDirection(angle)})
      </p>
    </div>
  );
};

export default Compass;
