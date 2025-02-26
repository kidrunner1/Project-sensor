import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

const fetchWeather = async (location, days = 7) => {
    if (!API_KEY) {
        console.error("❌ Weather API key is missing.");
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`);

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch weather data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("❌ Error fetching weather data:", error);
        return null;
    }
};

const WeatherChart = ({ location }) => {
    const [timeRange, setTimeRange] = useState("24h");
    const [chartData, setChartData] = useState({
        dateList: [],
        tempAvg: [],
        conditionText: [],
    });

    useEffect(() => {
        async function getWeather() {
            const days = timeRange === "24h" ? 1 : 7;
            const data = await fetchWeather(location, days);

            if (!data) return;

            let dateList = [];
            let tempAvg = [];
            let conditionText = [];

            if (timeRange === "24h") {
                const hourlyData = data.forecast.forecastday[0]?.hour || [];
                dateList = hourlyData.map((hour) => hour.time.split(" ")[1]);
                tempAvg = hourlyData.map((hour) => hour.temp_c);
                conditionText = hourlyData.map((hour) => hour.condition.text);
            } else {
                dateList = data.forecast.forecastday.map((day) => day.date);
                tempAvg = data.forecast.forecastday.map((day) => day.day.avgtemp_c);
                conditionText = data.forecast.forecastday.map((day) => day.day.condition.text);
            }

            setChartData({ dateList, tempAvg, conditionText });
        }

        getWeather();
    }, [location, timeRange]);

    const option = {
        title: {
            left: "center",
            text: `รายงานอุณหภูมิ (${timeRange === "24h" ? "24 ชั่วโมงล่าสุด" : "7 วันล่าสุด"})`,
            textStyle: {
                fontSize: 16,
                fontWeight: "bold",
            },
        },
        grid: {
            left: "5%",
            right: "5%",
            bottom: "15%",
            containLabel: true,
        },
        tooltip: {
            trigger: "axis",
            formatter: (params) => {
                const index = params[0].dataIndex;
                return `
                    <div style="text-align: center;">
                        <strong>${chartData.conditionText[index]}</strong><br/>
                        Temperature: ${params[0].value}°C
                    </div>
                `;
            },
        },
        xAxis: {
            type: "category",
            data: chartData.dateList,
        },
        yAxis: {
            type: "value",
            name: "อุณหภูมิ (°C)",
        },
        series: [
            {
                name: "Avg Temp",
                type: "line",
                data: chartData.tempAvg,
                smooth: true,
                showSymbol: true,
                symbolSize: 10,
                itemStyle: { color: "#ffcc00" },
            },
        ],
    };

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">สภาพอากาศ</h2>
                <select
                    className="bg-gray-100 text-black p-2 rounded-md"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="24h">24 ชั่วโมง</option>
                    <option value="7d">7 วัน</option>
                </select>
            </div>
            <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
            <div className="mt-4 text-center text-sm text-gray-600">
                <p>⚠️ คำแนะนำ: ตรวจสอบอุณหภูมิและความเร็วลมในช่วงเวลาที่มีความเสี่ยงสูง เพื่อปรับการทำงานของระบบให้เหมาะสม</p>
            </div>
        </div>
    );
};

export default WeatherChart;
