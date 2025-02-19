import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/images/home.png",
        label: "Home",
        url: "/Home",
        hasDropdown: false, // ไม่มี Dropdown
      },
      {
        icon: "/images/assignment.png",
        label: "Dashboard",
        url: "#", // ใช้ "#" เพราะมี Submenu
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
        hasDropdown: false, // ไม่มี Dropdown
      },
    ],
  },
];

const Menu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2 text-center text-white" key={i.title}>
          <span className="hidden lg:block text-white font-light my-4 uppercase tracking-wide">
            {i.title}
          </span>
          {i.items.map((item) => (
            <div key={item.label}>
              {item.hasDropdown ? (
                // ถ้าเป็นเมนูที่มี Dropdown (เช่น Dashboard)
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center justify-center lg:justify-start gap-4 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-800 hover:text-gray-300 w-full ${
                    dropdownOpen ? "bg-gray-800 text-gray-300" : ""
                  }`}
                >
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                  <i
                    className={`fas fa-chevron-down transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>
              ) : (
                // ถ้าเป็นเมนูปกติ (Home, Setting) ให้ใช้ <Link>
                <Link
                  href={item.url}
                  className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-800 hover:text-gray-300 w-full"
                >
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              )}

              {/* เมนูย่อย (Dropdown) */}
              {item.hasDropdown && dropdownOpen && (
                <div className="ml-6 mt-2 space-y-2 transition-all duration-300">
                  {item.subItems.map((subItem) => (
                    <Link
                      href={subItem.url}
                      key={subItem.label}
                      className="block text-gray-300 hover:text-white transition duration-300 py-1 px-3 rounded-md hover:bg-gray-700"
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
  );
};

export default Menu;
