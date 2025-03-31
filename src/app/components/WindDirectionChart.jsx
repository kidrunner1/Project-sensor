"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useSensorStore } from "@/app/serviveAPI/LoadDataSensor/ServiceLoadData";

const WindDirectionChart = ({ selectedSensor }) => {
    const { sensorData } = useSensorStore();
    const chartRef = useRef(null);
    const myChart = useRef(null);

    const [isDarkTheme, setIsDarkTheme] = useState(() =>
        document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkTheme(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!chartRef.current || !sensorData || !selectedSensor) return;

        if (!myChart.current) {
            myChart.current = echarts.init(chartRef.current, isDarkTheme ? "dark" : null);
        }

        const windDirectionParam = sensorData?.[selectedSensor]?.environmental?.find((param) =>
            param.param.toLowerCase().includes("wind_direct")
        );

        const windSpeedParam = sensorData?.[selectedSensor]?.environmental?.find((param) =>
            param.param.toLowerCase().includes("wind_speed")
        );

        if (!windDirectionParam || !windSpeedParam) return;

        const combined = windDirectionParam.readings.map((reading, i) => {
            const degreeRaw = String(reading.value).replace("degrees", "").trim();
            const degree = parseFloat(degreeRaw);
            const speed = parseFloat(windSpeedParam.readings?.[i]?.value ?? 0);

            if (isNaN(degree) || isNaN(speed)) return null;

            return { degree, speed };
        }).filter(Boolean);



        // สร้าง buckets: ทิศทาง => ค่าเฉลี่ย wind_speed
        const getDirectionLabel = (degree) => {
            if (typeof degree !== "number" || isNaN(degree)) return null;
            const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
            const index = Math.round(degree / 45) % 8;
            return dirs[index];
        };

        const directionData = {};
        combined.forEach(({ degree, speed }) => {
            const dir = getDirectionLabel(degree);
            if (!dir) return;

            if (!directionData[dir]) directionData[dir] = { total: 0, count: 0 };
            directionData[dir].total += speed;
            directionData[dir].count += 1;
        });

        const directions = Object.keys(directionData);
        const avgSpeeds = directions.map((dir) => (directionData[dir].total / directionData[dir].count).toFixed(2));


        const option = {
            angleAxis: {
                type: "category",
                data: directions,
                axisLabel: { color: isDarkTheme ? "#fff" : "#333" },
            },
            radiusAxis: {},
            polar: {},
            tooltip: {
                trigger: "item",
                formatter: (params) => `${params.name}: ${params.value} m/s`,
            },
            series: [
                {
                    type: "bar",
                    data: avgSpeeds,
                    coordinateSystem: "polar",
                    name: "ความเร็วลมเฉลี่ย",
                    itemStyle: { color: "#4FC3F7" },
                },
            ],
        };

        if (directions.length === 0 || avgSpeeds.every((s) => s === "0.00")) {
            myChart.current.clear();
            return;
        }

        myChart.current.setOption(option);
        myChart.current.resize();

        window.addEventListener("resize", () => myChart.current.resize());
        return () => {
            window.removeEventListener("resize", () => myChart.current.resize());
        };
    }, [sensorData, selectedSensor, isDarkTheme]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition duration-300">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                ทิศทางลมจาก Sensor ({selectedSensor})
            </h2>
            <div ref={chartRef} className="w-full h-[400px]" />
        </div>
    );
};

export default WindDirectionChart;
