"use client";
import { useState } from "react";
import Link from "next/link";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaHome, FaChartLine } from "react-icons/fa";
import { IoIosArrowDown, IoMdSettings } from "react-icons/io";

// ✅ เมนู
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
        icon: <FaChartLine />,
        label: "Dashboard",
        url: "#",
        hasDropdown: true,
        subItems: [
          { label: "Overview", url: "/MainDashboard" },
          { label: "Analytics", url: "/Analytics" },
          { label: "Report", url: "/LoadDataPage" },
        ],
      },
      {
        icon: <IoMdSettings />,
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

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="flex">
      <div
        className={`h-screen bg-white dark:bg-gray-800 p-5 pt-8 relative duration-300 ${isOpen ? "w-60" : "w-20"
          }`}
      >
        {/* ปุ่ม Toggle */}
        <button
          className="absolute -right-3 top-9 bg-gray-200 dark:bg-white text-gray-800 p-1 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>

        {/* โลโก้ */}
        <h1 className={`text-gray-900 dark:text-white text-lg font-bold mb-6 ${!isOpen && "hidden"}`}>
          DOGNOSE
        </h1>

        {/* เมนู */}
        <div className="mt-4 text-sm">
          {menuItems.map((i) => (
            <div className="flex flex-col gap-2 text-center" key={i.title}>
              <span
                className={`hidden lg:block text-gray-800 dark:text-gray-400 font-light my-4  uppercase tracking-wide ${!isOpen && "hidden"
                  }`}
              >
                {i.title}
              </span>

              {i.items.map((item, index) => (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center ${isOpen ? "justify-start" : "justify-center"
                        } gap-4 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-800 w-full ${openDropdown === index ? "bg-gray-200 dark:bg-gray-800" : ""
                        }`}
                    >
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                      {isOpen && (
                        <IoIosArrowDown
                          className={`ml-auto transition-transform ${openDropdown === index ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.url}
                      className={`flex items-center ${isOpen ? "justify-start" : "justify-center"
                        } gap-4 text-gray-800 dark:text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-800 w-full`}
                    >
                      {item.icon}
                      {isOpen && <span>{item.label}</span>}
                    </Link>
                  )}

                  {item.hasDropdown && openDropdown === index && isOpen && (
                    <div className="ml-6 mt-2 space-y-2 transition-all duration-300">
                      {item.subItems.map((subItem) => (
                        <Link
                          href={subItem.url}
                          key={subItem.label}
                          className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-1 px-3 rounded-md transition"
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
