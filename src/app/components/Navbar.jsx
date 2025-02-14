"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/app/serviveAPI/Logout/logoutService";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const storedUserName = localStorage.getItem("userName") || "User";
    const storedUserEmail = localStorage.getItem("userEmail") || "user@example.com";

    if (accessToken) {
      setIsAuthenticated(true);
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
    } else {
      setIsAuthenticated(false);
      setUserName("");
      setUserEmail("");
    }
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      const handleOutsideClick = (event) => {
        if (!event.target.closest(".dropdown-menu")) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      setIsAuthenticated(false);
      setUserName("");
      setUserEmail("");

      Swal.fire({
        title: "ออกจากระบบสำเร็จ!",
        text: response.message,
        icon: "success",
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push(response.redirectTo);
      });
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.message || "ไม่สามารถออกจากระบบได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <nav className="bg-neutral-900 p-4 flex justify-end items-center">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-lg font-bold">
          <Link href="/Home">DOGNOSE</Link>
        </div>
      </div>

      {isAuthenticated && (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="text-white flex items-center focus:outline-none"
          >
            <Image
              src="/images/profile.png"
              width={50}
              height={50}
              className="w-8 h-8 rounded-full"
              alt="User photo"
            />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu absolute right-0 top-full mt-2 z-50 w-48 bg-white divide-y divide-gray-100 rounded-sm shadow-md dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3">
                <p className="text-sm text-gray-900 dark:text-white">{userName}</p>
                <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                  {userEmail}
                </p>
              </div>
              <ul className="py-1">
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    ออกจากระบบ
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
