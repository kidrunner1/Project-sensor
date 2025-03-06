// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { logoutUser } from "@/app/serviveAPI/Logout/logoutService";
// import { getUserData } from "@/app/serviveAPI/GetUser/serviceUser";
// import Swal from "sweetalert2";
// import Image from "next/image";
// import Link from "next/link";

// const Navbar = () => {
//   const [userData, setUserData] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const accessToken = sessionStorage.getItem("access_token");
//       const userId = sessionStorage.getItem("user_id");

//       if (!accessToken || !userId) {
//         setIsAuthenticated(false);
//         return;
//       }

//       try {
//         const userData = await getUserData(userId);
//         if (userData) {
//           setUserData(userData);
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setIsAuthenticated(false);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   useEffect(() => {
//     if (isDropdownOpen) {
//       const handleOutsideClick = (event) => {
//         if (!event.target.closest(".dropdown-menu")) {
//           setDropdownOpen(false);
//         }
//       };
//       document.addEventListener("mousedown", handleOutsideClick);
//       return () => document.removeEventListener("mousedown", handleOutsideClick);
//     }
//   }, [isDropdownOpen]);

//   const handleLogout = async () => {
//     try {
//       const response = await logoutUser();
//       setIsAuthenticated(false);
//       setUserData(null);

//       Swal.fire({
//         title: "ออกจากระบบสำเร็จ!",
//         text: response.message,
//         icon: "success",
//         confirmButtonText: "ตกลง",
//       }).then(() => {
//         router.push(response.redirectTo);
//       });
//     } catch (error) {
//       Swal.fire({
//         title: "เกิดข้อผิดพลาด",
//         text: error.message || "ไม่สามารถออกจากระบบได้",
//         icon: "error",
//         confirmButtonText: "ตกลง",
//       });
//     }
//   };

//   return (
//     <nav className="bg-neutral-900 p-4 flex justify-end items-center">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <div className="text-white text-xl font-bold tracking-wide">
//           <Link href="/Home">DOGNOSE</Link>
//         </div>

//         {isAuthenticated && (
//           <div className="relative">
//             <button
//               onClick={() => setDropdownOpen(!isDropdownOpen)}
//               className="text-white flex items-center space-x-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition duration-300"
//             >
//               <Image
//                 src="/images/profile.png"
//                 width={40}
//                 height={40}
//                 className="w-10 h-10 rounded-full border-2 border-gray-500"
//                 alt="User photo"
//               />
//               <span className="text-sm font-medium hidden sm:block">{userData?.name}</span>
//             </button>

//             {/* Dropdown Menu */}
//             <div
//               className={`dropdown-menu absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all ${
//                 isDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
//               }`}
//             >
//               <div className="px-5 py-4 bg-gray-100 dark:bg-gray-700">
//                 <p className="text-sm font-semibold text-gray-900 dark:text-white">{userData?.name}</p>
//                 <p className="text-xs text-gray-600 dark:text-gray-300">{userData?.email}</p>
//               </div>
//               <ul className="py-2">
//                 <li>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-red-400 transition duration-200"
//                   >
//                     ออกจากระบบ
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/app/serviveAPI/Logout/logoutService";
import { getUserData } from "@/app/serviveAPI/GetUser/serviceUser";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiBell, FiMessageSquare, FiChevronDown } from "react-icons/fi";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = sessionStorage.getItem("access_token");
      const userId = sessionStorage.getItem("user_id");

      if (!accessToken || !userId) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const userData = await getUserData(userId);
        if (userData) {
          setUserData(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAuthenticated(false);
      }
    };

    fetchUserDetails();
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
      setUserData(null);

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
    <nav className="bg-gray-100 px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left: Welcome Message */}
      <h1 className="text-xl font-semibold text-gray-800">
        DOGNOSE Good morning, <span className="font-bold">{userData?.name || "User"}!</span>
      </h1>

      {/* Right: Icons & Profile */}
      {isAuthenticated && (
        <div className="flex items-center gap-6">
          {/* Icons */}
          <FiCalendar className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition" />
          <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition" />
          <FiMessageSquare className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition" />

          {/* Profile Image + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2"
            >
              <Image
                src={userData?.profileImage || "/images/profile.png"}
                alt="User"
                width={40}
                height={40}
                className="rounded-full border border-gray-300"
              />
              <FiChevronDown className="text-gray-600 text-lg" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md py-2 dropdown-menu">
                <div className="px-5 py-4 bg-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userData?.name}</p>
                  <p className="text-xs text-gray-600">{userData?.email}</p>
                </div>
                <ul className="py-2">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-gray-200 transition duration-200"
                    >
                      ออกจากระบบ
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
