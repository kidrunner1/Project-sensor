"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { AuthProvider } from "@/app/context/AuthContext"; // ✅ Import `AuthProvider`
import dynamic from "next/dynamic";

// ✅ Lazy Load Components
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });
const Sidebar = dynamic(() => import("../components/Sidebar"), { ssr: false });

const queryClient = new QueryClient();

export default function DashboardLayout({ children }) {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class">
                    <Head>
                        <title>Dashboard - My App</title>
                        <meta name="description" content="Dashboard for managing your app." />
                    </Head>

                    <div className="flex w-screen h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
                        {/* Sidebar */}
                        <div className="h-screen hidden md:block">
                            <Sidebar />
                        </div>

                        {/* Main Content Area */}
                        <div className="flex flex-col flex-1 h-screen">
                            {/* Navbar */}
                            <Navbar />

                            {/* Content Section */}
                            <div className="flex flex-col flex-1 overflow-y-auto p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </ThemeProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
}
