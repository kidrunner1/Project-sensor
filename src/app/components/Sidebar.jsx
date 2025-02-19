import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/images/home.png",
        label: "Home",
        url: "/Home",
        hasDropdown: false,
      },
      {
        icon: "/images/assignment.png",
        label: "Dashboard",
        url: "#",
        hasDropdown: true,
        subItems: [
          { label: "Overview", url: "/MainDashboard" },
          { label: "Analytics", url: "/Analytics" },
          { label: "Reports", url: "/Setting" },
        ],
      },
      {
        icon: "/images/setting.png",
        label: "Setting",
        url: "/Setting",
        hasDropdown: false,
      },
    ],
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null); // ควบคุม Dropdown

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="flex">
      {/* Sidebar Container */}
      <div
        className={`h-screen bg-zinc-900 p-5 pt-8 relative duration-300 ${
          isOpen ? "w-56" : "w-20"
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
          {menuItems.map((i) => (
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
                      className={`flex items-center ${
                        isOpen ? "justify-start" : "justify-center"
                      } gap-4 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-800 hover:text-white w-full ${
                        openDropdown === index ? "bg-gray-800 text-white" : ""
                      }`}
                    >
                      <Image src={item.icon} alt={item.label} width={20} height={20} />
                      {isOpen && <span>{item.label}</span>}
                      {isOpen && (
                        <i
                          className={`fas fa-chevron-down transition-transform duration-300 ${
                            openDropdown === index ? "rotate-180" : ""
                          }`}
                        ></i>
                      )}
                    </button>
                  ) : (
                    // Link Menu
                    <Link
                      href={item.url}
                      className={`flex items-center ${
                        isOpen ? "justify-start" : "justify-center"
                      } gap-4 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-800 hover:text-white w-full`}
                    >
                      <Image src={item.icon} alt={item.label} width={20} height={20} />
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
