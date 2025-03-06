"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaHome, FaChartBar, FaCogs, FaTasks } from "react-icons/fa";

// ✅ รายการเมนู Sidebar
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <FaHome />,
        label: "Home",
        url: "/HomePage",
        hasDropdown: false,
      },
      {
        icon: <FaChartBar />,
        label: "Dashboard",
        url: "#",
        hasDropdown: true,
        subItems: [
          { label: "Overview", url: "/MainDashboard" },
          { label: "Live Network", url: "/Analytics" },
          { label: "To-Do’s", url: "/Todos" },
        ],
      },
      {
        icon: <FaCogs />,
        label: "Setting",
        url: "/Setting",
        hasDropdown: false,
      },
    ],
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  // ✅ เปิด-ปิด Dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="flex">
      {/* Sidebar Container */}
      <div
        className={`h-screen bg-gray-900 p-5 pt-8 relative duration-300 ${isOpen ? "w-60" : "w-20"
          }`}
      >
        {/* ปุ่ม Toggle */}
        <button
          className="absolute -right-3 top-9 bg-white p-1 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>

        {/* โลโก้ */}
        <h1 className={`text-white text-lg font-bold mb-6 ${!isOpen && "hidden"}`}>
          DOGNOSE
        </h1>

        {/* Menu Items */}
        <div className="mt-4 text-sm">
          {menuItems?.map((i) => (
            <div className="flex flex-col gap-2 text-center text-white" key={i.title}>
              <span className={`hidden lg:block text-white font-light my-4 ml-2 uppercase tracking-wide ${!isOpen && "hidden"}`}>
                {i.title}
              </span>
              
              {i.items.map((item, index) => (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    // Dropdown Menu
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center ${isOpen ? "justify-start" : "justify-center"
                        } gap-4 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-800 w-full ${openDropdown === index ? "bg-gray-800" : ""
                        }`}
                    >
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                      {isOpen && (
                        <span className={`ml-auto transition-transform ${openDropdown === index ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      )}
                    </button>
                  ) : (
                    // Link Menu
                    <Link
                      href={item.url}
                      className={`flex items-center ${isOpen ? "justify-start" : "justify-center"
                        } gap-4 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-800 w-full`}
                    >
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                    </Link>
                  )}

                  {/* Submenu */}
                  {item.hasDropdown && openDropdown === index && isOpen && (
                    <div className="ml-6 mt-2 space-y-2 transition-all duration-300">
                      {item.subItems.map((subItem) => (
                        <Link
                          href={subItem.url}
                          key={subItem.label}
                          className="block text-white hover:text-white transition duration-300 py-1 px-3 rounded-md hover:bg-gray-700"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
