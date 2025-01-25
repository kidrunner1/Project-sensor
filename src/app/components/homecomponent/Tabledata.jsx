import React from "react";

const TableData = ({ name }) => {
  const data = [
    {
      time: "10:00 AM",
      station: "Station 1",
      orderLevel: "High",
      temp: "22°C",
      humidity: "60%",
    },
    {
      time: "11:00 AM",
      station: "Station 2",
      orderLevel: "Medium",
      temp: "24°C",
      humidity: "55%",
    },
    // Add more data as needed
  ];

  return (
    <div className="p-4 border-1 mx-1 rounded-2xl bg-white flex-1 h-[300px]">
      <h2 className="mb-4 font-semibold text-sm">{name}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Time</th>
              <th className="px-4 py-2 border-b">Station</th>
              <th className="px-4 py-2 border-b">Order Level</th>
              <th className="px-4 py-2 border-b">Temp</th>
              <th className="px-4 py-2 border-b">Humidity</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-2">{item.time}</td>
                <td className="px-4 py-2">{item.station}</td>
                <td className="px-4 py-2">{item.orderLevel}</td>
                <td className="px-4 py-2">{item.temp}</td>
                <td className="px-4 py-2">{item.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableData;
