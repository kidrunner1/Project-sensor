"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { reloadPage } from "@/app/serviveAPI/ReloadPage/reloadpageService";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function DashboardLayout({ children }) {
    useEffect(() => {
        reloadPage(); // ✅ ตรวจสอบ Token เมื่อเข้า Dashboard
        const interval = setInterval(reloadPage, 60000); // 🔄 ตรวจสอบทุก ๆ 1 นาที
        return () => clearInterval(interval); // 🛑 ล้าง Interval เมื่อออกจากหน้า
    }, []);

    return (
        <div className="flex w-screen h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <div className="h-screen hidden md:block">
                <Sidebar />
            </div>
            {/* Main Content Area */}
            <div className="flex flex-col flex-1 h-screen">
                {/* Navbar (ถ้ามี) */}
                <Navbar />

                {/* Content Section */}
                <div className="flex flex-col   justify-center ">
                    {children}
                </div>
            </div>
        </div>
    );
}
