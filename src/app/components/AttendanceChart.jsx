"use client";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

const data = [
  {
    name: "จ",
    temp: 21,
    wind: 59,
  },
  {
    name: "อ",
    temp: 12,
    wind: 71,
  },
  {
    name: "พ",
    temp: 21,
    wind: 64,
  },
  {
    name: "พฤ",
    temp: 21,
    wind: 21,
  },
  {
    name: "ศ",
    temp: 23,
    wind: 34,
  },
  {
    name: "ส",
    temp: 25,
    wind: 74,
  },
  {
    name: "อา",
    temp: 11,
    wind: 56,
  },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/images/more.png" alt="" width={25} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} />
          <YAxis axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            name="อุณหภูมิ"
            dataKey="temp"
            fill="#C3EBFA"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            name="ความเร็วลม"
            dataKey="wind"
            fill="#FAE27C"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
