"use client";

import React, { use, useEffect } from "react";
import AttendanceChart from "../../components/AttendanceChart";
import Card from "../../components/Card";
import CountChart from "../../components/CountChart";
import BottomChart from "../../components/BottomChart";
// import Compass from "../../components/Compass";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const HomePageTest = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if user is not authenticated
        router.push("/");
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [router]);
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Left */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* TEMP CARD */}
        <div className="flex gap-4 justify-between flex-wrap">
          <Card type="ความชื้น" int="23" />
          <Card type="อุณหภูมิ" int="21" />
          <Card type="ความเร็วลม" int="32" />
          <Card type="ทิศทางลม" int="12" />
        </div>
        {/* MIDDLE CHART */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full h-[450px]">
            <CountChart />
          </div>
          {/* เข็มทิศ */}
          <div className="w-full  h-[450px]">
            {/* <Compass /> */}
          </div>
        </div>
        {/* ATTENDENCE CHART */}
        <div className="w-full  h-[450px]">
          <AttendanceChart />
        </div>
        {/* BOTTOM CHART */}
        <div className="flex w-full h-[500px]">
          <BottomChart />
        </div>
        <div className="w-full h-[450px]"></div>
      </div>
      {/* Right */}
      <div className="w-full lg:w-1/3">Right</div>
    </div>
  );
};

export default HomePageTest;
