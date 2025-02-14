"use client";

import React, { useEffect, useState } from "react";
import AttendanceChart from "../../components/AttendanceChart";
import Card from "../../components/Card";
import CountChart from "../../components/CountChart";
import BottomChart from "../../components/BottomChart";
import { useRouter } from "next/navigation";
import ExportData from "@/app/components/ExportData";

const HomePageTest = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // ✅ ดึง Token จาก LocalStorage
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (!accessToken) {
      console.warn("🔴 No access token found, redirecting to login...");
      logoutUser();
      return;
    }

    // ✅ ตรวจสอบว่า Token หมดอายุหรือไม่
    if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
      console.warn("🔴 Token expired, logging out...");
      logoutUser();
      return;
    }

    // ✅ ถ้ามี Token และยังไม่หมดอายุ -> ถือว่าเข้าสู่ระบบสำเร็จ
    setIsAuthenticated(true);
  }, []);

  // ✅ ฟังก์ชัน Logout อัตโนมัติถ้า Token หมดอายุ
  const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.push("/");
  };

  // ✅ ป้องกัน Rendering ก่อนเช็คว่า Authenticated หรือไม่
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        🔄 กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Left */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* TEMP CARD */}
        <div className="flex gap-4 justify-between flex-wrap">
          <Card type="ความชื้น" />
          <Card type="อุณหภูมิ" />
          <Card type="ความเร็วลม" />
        </div>

        {/* MIDDLE CHART */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full h-[450px]">
            <CountChart />
          </div>
        </div>

        {/* ATTENDENCE CHART */}
        <div className="w-full h-[550px] ">
          <AttendanceChart />
        </div>

        {/* BOTTOM CHART */}
        <div className="flex w-full h-[500px] mt-5">
          <BottomChart />
        </div>
        <div className="w-full h-[450px]"></div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/3">
        <div className="w-full">
          <ExportData name="Export Data" />
        </div>
      </div>
    </div>
  );
};

export default HomePageTest;
