"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/app/serviveAPI/GetUser/serviceUser";
import { FiUser, FiMail, FiPhone, FiCamera } from "react-icons/fi";
import Image from "next/image";

export default function PersonalProfile() {
  const [userData, setUserData] = useState(null);
  const [imageURL, setImageURL] = useState("/images/profile.png");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_token");
      const userId = localStorage.getItem("user_id");

      if (!accessToken || !userId) {
        console.warn("Missing access_token or user_id in localStorage.");
        return;
      }

      try {
        const userData = await getUserData(userId);
        if (userData) {
          setUserData(userData);
          setImageURL(userData.avatar || "/images/profile.png");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        🔄 กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-6 ">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Image
              src={imageURL}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full border-4 border-gray-300 dark:border-gray-600"
            />
            <div className="absolute bottom-1 right-1 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow">
              <FiCamera className="text-gray-600 dark:text-gray-300 text-xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">
            {userData?.name || "No Name"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.email}</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <FiMail className="text-gray-600 dark:text-gray-300 text-xl" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">อีเมล</p>
              <p className="text-gray-900 dark:text-white">{userData?.email || "No Email"}</p>
            </div>
          </div>

          {/* Name */}
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <FiUser className="text-gray-600 dark:text-gray-300 text-xl" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">ชื่อ - นามสกุล</p>
              <p className="text-gray-900 dark:text-white">{userData?.name || "No Name"}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <FiPhone className="text-gray-600 dark:text-gray-300 text-xl" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">เบอร์โทรศัพท์</p>
              <p className="text-gray-900 dark:text-white">{userData?.phone || "No Phone Number"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
