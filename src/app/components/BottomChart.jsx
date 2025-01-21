"use client";

import {
  LineChart,
  Line,
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
    name: "ระยะเวลา",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "ระยะเวลา",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "ระยะเวลา",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "ระยะเวลา",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
];

const BottomChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between itm-center">
        <h1 className="text-lg font-semibold">อุณหภูมิ</h1>
        <Image src="/images/more.png" alt="" width={25} height={20} />
      </div>
      <div className="relative w-full h-[85%]">
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
              tickMargin={10}
            />
            <Tooltip />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
            />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              strokeWidth={5}
            />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={5}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BottomChart;
