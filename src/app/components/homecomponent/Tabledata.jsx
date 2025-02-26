"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const DataTable = ({ pollutionData }) => {
  // ✅ ตั้งค่า Columns
  const columns = useMemo(
    () => [
      { id: "time", header: "⏳ เวลา", accessorKey: "time" },
      {
        id: "o3",
        header: "🌍 โอโซน (O₃) (ppb)",
        accessorKey: "o3",
        cell: ({ getValue }) => (
          <span className={getValue() > 100 ? "text-red-500 font-bold" : "text-green-500"}>{getValue()}</span>
        ),
      },
      {
        id: "ch2o",
        header: "🧪 ฟอร์มาลดีไฮด์ (CH₂O) (ppm)",
        accessorKey: "ch2o",
        cell: ({ getValue }) => (
          <span className={getValue() > 0.1 ? "text-red-500 font-bold" : "text-green-500"}>{getValue().toFixed(3)}</span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: pollutionData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold">📊 ตารางข้อมูลมลพิษ</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th key={column.id}>{flexRender(column.column.columnDef.header, column.getContext())}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>{row.getVisibleCells().map((cell) => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
