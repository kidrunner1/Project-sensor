"use client";

import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";

// ✅ ฟังก์ชันแปลงปี ค.ศ. → พ.ศ.
const convertToBuddhistYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("th-TH", { month: "long" }); // เดือนภาษาไทย
  const year = date.getFullYear() + 543; // พ.ศ.
  return `${day} ${month} ${year}`;
};

const CustomDatepicker = ({ onDateChange }) => {
  const [value, setValue] = useState({ startDate: null, endDate: null });
  const { setDateRange, filterSensorDataByDateRange } = useSensorStore();

  const handleChange = (newValue) => {
    setValue(newValue);
    setDateRange(newValue);
    filterSensorDataByDateRange(newValue);
    onDateChange(newValue);
  };

  return (
    <div className="relative max-w-md w-[300px] mt-1 mb-1">
      <Datepicker
        value={value}
        onChange={handleChange}
        useRange={true}
        displayFormat="DD MMMM YYYY" // ปล่อยเป็น default แล้วค่อยแปลงตอนแสดง
        i18n="th" // ✅ ภาษาไทย
        showShortcuts={false} // ✅ ปิด Today / Last 7 Days
        placeholder={"เลือกช่วงวันที่"}
        separator=" ถึง "
        popoverDirection="down"
        inputClassName="w-full h-10 text-sm leading-tight py-2 pl-4 pr-12 border border-gray-300 rounded-md text-gray-800 dark:text-white bg-white dark:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        toggleClassName="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-white"
      />
    </div>
  );
};

export default CustomDatepicker;
