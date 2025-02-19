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
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const tokenExpiry = localStorage.getItem("token_expiry");

    if (!accessToken) {
      console.warn("🔴 No access token found, redirecting to login...");
      logoutUser();
      return;
    }

    if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
      console.warn("🔴 Token expired, logging out...");
      logoutUser();
      return;
    }

    setIsAuthenticated(true);
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.push("/");
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        🔄 กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="flex h-screen">

      {/* Main Content (Scroll ได้เฉพาะส่วนนี้) */}
      <div className="flex-1 flex flex-col overflow-auto h-screen p-4">
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* TEMP CARD */}
          <div className="flex gap-4 justify-between flex-wrap">
            <Card type="ความชื้น" />
            <Card type="อุณหภูมิ" />
            <Card type="ความเร็วลม" />
          </div>

          {/* MIDDLE CHART */}
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="w-full h-[450px]">
              <CountChart />
            </div>
          </div>

          {/* ATTENDANCE CHART */}
          <div className="w-full h-[550px]">
            <AttendanceChart />
          </div>

          {/* BOTTOM CHART */}
          <div className="flex w-full h-[500px] mt-5">
            <BottomChart />
          </div>

          {/* Empty Space */}
          <div className="w-full h-[450px]"></div>
        </div>
      </div>

  
    </div>
  );
};

export default HomePageTest;
