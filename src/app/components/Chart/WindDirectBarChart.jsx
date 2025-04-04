"use client";
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

const WindDirectBarChart = ({ sensorData, selectedSensor, dateRange }) => {
    if (!sensorData || !sensorData.environmental)
        return <p>ไม่มีข้อมูล Sensor</p>;

    const winddirectData = sensorData.environmental.find((entry) =>
        entry.param.toLowerCase().includes("wind_direct")
    );

    const formatTimestamp10Min = (timestamp) => {
        const d = new Date(timestamp);
        d.setMinutes(Math.floor(d.getMinutes() / 30) * 30, 0, 0);  // ปัดลงทุก 10 นาที
        return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = (date.getFullYear() + 543).toString().slice(-2); // เอา 2 หลักท้าย
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    if (!winddirectData || !winddirectData.readings?.length) {
        return <p className="text-gray-900 dark:text-white">⏳ กำลังโหลดข้อมูลความเร็วลม...</p>;
    }

    const isDateRangeSelected = dateRange?.startDate && dateRange?.endDate;

    const readings = useMemo(() => {
        if (!isDateRangeSelected) {
            const today = new Date();
            return winddirectData.readings.filter((r) => {
                const t = new Date(r.timestamp);
                return (
                    t.getDate() === today.getDate() &&
                    t.getMonth() === today.getMonth() &&
                    t.getFullYear() === today.getFullYear()
                );
            });
        }
        return winddirectData.readings;
    }, [winddirectData.readings, isDateRangeSelected, dateRange]);

    const groupedData = useMemo(() => {
        const map = new Map();
        for (const r of readings) {
            const label = formatTimestamp10Min(r.timestamp);
            if (!map.has(label)) map.set(label, []);
            map.get(label).push(r.value);
        }

        const labels = [...map.keys()];
        const averages = labels.map((label) => {
            const values = map.get(label);
            const sum = values.reduce((acc, val) => acc + val, 0);
            return parseFloat((sum / values.length).toFixed(2));
        });

        return { labels, averages };
    }, [readings]);

    const formatDateShort = (date) => {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${(d.getFullYear() + 543).toString().slice(-2)}`;
    };

    const chartOption = useMemo(() => ({
        grid: {
            left: "3%", // ✅ ขยายพื้นที่กราฟ
            right: "3%",
            bottom: "15%",
            containLabel: true,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (params) => {
                const index = params[0].dataIndex;
                const timestamp = formatTimestamp(readings[index]?.timestamp);
                return `
                  <div style="text-align: center;">
                    <strong>อุณหภูมิ</strong><br/>
                    ${timestamp}<br/>
                    <strong>${params[0].value.toFixed(2)}</strong>°C
                  </div>
                `;
            },
        },
        xAxis: {
            type: "category",
            data: groupedData.labels,
            axisLabel: { rotate: 0 },
        },
        yAxis: {
            type: "value",
            name: "องศา (°)",
            axisLabel: {
                formatter: "{value}°",
            },
        },
        series: [
            {
                name: "ทิศทางลม",
                type: "bar",
                data: groupedData.averages,
                itemStyle: {
                    color: "#29b6f6",
                    borderRadius: [3, 3, 0, 0],
                },

                barWidth: "60%",
            },
        ],
    }), [groupedData]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md h-[420px]">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">ทิศทางลม</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    เซ็นเซอร์ : {sensorData?.sensor_name || selectedSensor}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                    ช่วงวันที่เลือก:{" "}
                    {isDateRangeSelected
                        ? `${formatDateShort(dateRange.startDate)} ถึง ${formatDateShort(dateRange.endDate)}`
                        : "วันนี้"}
                </p>
            </div>
            <ReactECharts option={chartOption} style={{ height: "350px", width: "100%" }} />
        </div>
    );
};

export default WindDirectBarChart;
