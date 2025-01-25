import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import Image from "next/image";
import Link from "next/link";
import HomePageTest from "./MainDashboard/page";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "DOGNOSE",
    description: "Generated by create next app",
};

export default function DashboardLayout({ children }) {
    return (

        <div className="h-screen flex">
            {/* Left */}
            <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
                <Link href="/Home" className="flex items-center justify-center lg:justify-start gap-2 ml-2 mt-2">
                    {/* <Image src="/images/logoweb.png" alt="logo" width={32} height={32} /> */}
                    <span className="hidden lg:block text-zinc-500">DOGNOSE</span>
                </Link>
                <Menu />
            </div>
            {/* Right */}
            <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-zinc-300 overflow-scroll">
                <Navbar />
                {children}
            </div>
        </div>

    );
}
