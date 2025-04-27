"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts";
import { FaEllipsisH } from "react-icons/fa";
import { ArrowDownToLine } from "lucide-react"; // ✅ ใช้ไอคอนจาก lucide-react
import html2canvas from "html2canvas";

const FIXED_GAS_COLORS = {
  h2s1: "#FF6B6B",
  h2s2: "#4BC0C0",
  h2s3: "#F9A825",
  h2s4: "#9575CD",
};

const formatTimestamp = (ts) => {
  if (!ts) return "ไม่มีข้อมูล";
  const d = new Date(ts);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${(d.getFullYear() + 543).toString().slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
const formatTimeX = (ts) => {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const isToday = (ts, latest) => {
  const d1 = new Date(ts), d2 = new Date(latest);
  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

const LineChartGas = ({ gasData, selectedSensor, sensorName, dateRange }) => {

  const chartRef = useRef(null);
  const myChart = useRef(null);
  const [fakeClock, setFakeClock] = useState(new Date());
  const baseTime = useRef(null);
  const clientStart = useRef(null);
  const chartInstanceRef = useRef(null);
  const [selectedRange, setSelectedRange] = useState("today");
  const timeRanges = {
    "15m": 15 * 60 * 1000,
    "30m": 30 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "12h": 12 * 60 * 60 * 1000,
    "today": "today", // พิเศษ
    "7d": 7 * 24 * 60 * 60 * 1000,
  };
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const graphRef = useRef(null); // ใช้ ref เพื่อเลือกกราฟ

  const adjustH2SValue = (param, value) => {
    if (param.toLowerCase().includes("h2s")) {
      const adjustment = 0;  // ✅ บวกเพิ่ม
      const multiadjustment = 0.5; // ✅ คูณเพิ่ม
      const adjusted = (value * multiadjustment) + adjustment;
      return adjusted < 0 ? 0 : adjusted; // ✅ ถ้าติดลบ → เซ็ตเป็น 0
    }
    return value;
  };

  const handleCaptureScreenshot = async () => {
    if (!graphRef.current) return;
    
    try {
      const canvas = await html2canvas(graphRef.current, {
        scale: 3, // ปรับเพิ่มความละเอียดภาพ (สูงสุดที่ต้องการ)
        width: graphRef.current.scrollWidth, // กำหนดขนาดที่ต้องการตามขนาดของ div
        height: graphRef.current.scrollHeight, // ขยายพื้นที่แคปเจอร์ในแนวตั้ง
        useCORS: true, // ใช้ CORS เพื่อดึงข้อมูลจากแหล่งที่มาภายนอก
      });

      const image = canvas.toDataURL("image/png");

      // สร้างลิงก์สำหรับดาวน์โหลด
      const link = document.createElement("a");
      link.href = image;
      link.download = `graph-${new Date().toISOString()}.png`;
      link.click();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกรูปภาพ", error);
    }
  };

  const formatDateShort = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = (date.getFullYear() + 543).toString().slice(-2); // เอา 2 หลักท้าย
    return `${day}/${month}/${year}`;
  };

  const filterByRange = (readings, latestTs, range) => {
    if (!latestTs) return [];
    const now = new Date(latestTs);

    if (range === "today") {
      return readings.filter((r) => isToday(r.timestamp, now));
    }

    const from = new Date(now.getTime() - timeRanges[range]);
    return readings.filter((r) => new Date(r.timestamp) >= from);
  };

  const [showRangeMenu, setShowRangeMenu] = useState(false);
  const rangeMenuRef = useRef(null);

  const filterReadingsByDate = (readings) => {
    if (!dateRange?.startDate || !dateRange?.endDate) {
      // fallback → ใช้ range ปกติ
      return filterByRange(readings, readings.at(-1)?.timestamp, selectedRange);
    }

    const start = new Date(dateRange.startDate).getTime();
    const endDateObj = new Date(dateRange.endDate);
    endDateObj.setHours(23, 59, 59, 999); // ✅ ครอบคลุมทั้งวันสุดท้าย
    const end = endDateObj.getTime();

    return readings.filter((r) => {
      const ts = new Date(r.timestamp).getTime();
      return ts >= start && ts <= end;
    });
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rangeMenuRef.current && !rangeMenuRef.current.contains(e.target)) {
        setShowRangeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (baseTime.current && clientStart.current) {
        const diff = Date.now() - clientStart.current.getTime();
        setFakeClock(new Date(baseTime.current.getTime() + diff));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const latestTimestamp = useMemo(() => {
    return gasData[0]?.readings?.at(-1)?.timestamp;
  }, [gasData]);

  useEffect(() => {
    if (!chartRef.current || gasData.length === 0) return;

    const chart = myChart.current || echarts.init(chartRef.current, isDark ? "dark" : null);
    myChart.current = chart;
    chartInstanceRef.current = chart; // เพิ่มบรรทัดนี้

    const latestTs = gasData[0]?.readings?.at(-1)?.timestamp || "";
    if (latestTs) {
      const latestDate = new Date(latestTs);
      if (!baseTime.current || baseTime.current.getTime() !== latestDate.getTime()) {
        baseTime.current = latestDate;
        clientStart.current = new Date();
      }
    }

    // const latestTimestamp = gasData[0]?.readings?.at(-1)?.timestamp;
    const gasNames = gasData.map((g) => g.param);
    const colors = Object.fromEntries(gasNames.map((g) => [g, FIXED_GAS_COLORS[g.toLowerCase()] || "#999"]));
    const seriesData = gasNames.map((param) => {
      const allReadings = gasData.find((g) => g.param === param)?.readings || [];
      const filtered = filterReadingsByDate(allReadings, latestTimestamp, selectedRange);
      const values = filtered.map((r) => adjustH2SValue(param, parseFloat(r.value)).toFixed(2));
      
      return {
        name: param,
        type: "line",
        smooth: true,
        showSymbol: false,
        itemStyle: { color: colors[param] },
        lineStyle: { width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[param] },
            { offset: 1, color: "rgba(255,255,255,0)" },
          ]),
        },
        data: values, // ✅ ใช้ค่าที่กรองแล้ว
        markPoint: {
          data: [
            { type: "max", name: "สูงสุด", symbol: "triangle", symbolSize: 12, itemStyle: { color: "red" } },
            { type: "min", name: "ต่ำสุด", symbol: "triangle", symbolSize: 12, itemStyle: { color: "blue" } },
          ],
        },
      };
    });

    const referenceLines = gasData
      .filter((g) => g.safe_limit !== undefined && g.readings?.length)
      .map((g) => ({
        name: `${g.param} Safe Limit`,
        type: "line",
        data: Array(g.readings.length).fill(g.safe_limit),
        lineStyle: { type: "dashed", width: 2, color: "red" },
        label: { show: true, position: "right", formatter: `${g.param} ⚠️` },
      }));

    const option = {
      title: { left: "center", textStyle: { fontSize: 16, fontWeight: "bold" } },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: (params) => {
          const i = params[0]?.dataIndex;
          const filtered = filterReadingsByDate(gasData[0]?.readings || [], latestTimestamp, selectedRange);
          const ts = filtered?.[i]?.timestamp;
          return `<div style="text-align: center;">
            <strong>ค่าก๊าซในอากาศ</strong><br/>
            ${formatTimestamp(ts)}<br/>
            ${params.map((p) => `${p.marker} ${p.seriesName}: <strong>${p.value}</strong> ppm`).join("<br/>")}
          </div>`;
        },
      },
      dataZoom: [
        {
          type: "slider",      // แถบ slider ลากซูม
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          bottom: 40,
          height: 20,
        },
        {
          type: "inside",      // ซูมด้วย mouse wheel หรือ pinch บนมือถือ
          realtime: true,
          start: 0,
          end: 100,
        },
      ],
      legend: {
        data: [...gasNames, ...referenceLines.map((r) => r.name)],
        bottom: 0,
        selectedMode: "multiple",
      },
      grid: { left: "10%", right: "10%", bottom: "20%", containLabel: true },
      xAxis: {
        type: "category",
        data: filterReadingsByDate(gasData[0]?.readings || [], latestTimestamp, selectedRange)
          .map((r) => formatTimeX(r.timestamp)),
      },
      yAxis: {
        type: "value",
        name: "PPM",
        axisLabel: { formatter: (v) => parseFloat(v).toFixed(2) },
      },
      series: [...seriesData, ...referenceLines],
    };
    chart.setOption(option);
    chart.resize();
    const resizeHandler = () => chart.resize();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [gasData, selectedSensor, isDark]);

  return (
    <div ref={graphRef} className="bg-white rounded-xl w-full h-full p-4 shadow-md transition-all duration-500 dark:bg-gray-800 relative">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">ค่าก๊าซในอากาศ</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">เซ็นเซอร์ : {sensorName || selectedSensor}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">
        อัปเดตล่าสุด : {formatTimestamp(fakeClock)}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        ช่วงวันที่เลือก :{" "}
        {dateRange?.startDate && dateRange?.endDate
          ? `${formatDateShort(dateRange.startDate)} ถึง ${formatDateShort(dateRange.endDate)}`
          : "วันนี้"}
      </p>
      {/* ✅ ปุ่มเลือกช่วงเวลา (มุมขวาบนของกราฟ) */}
      {/* ✅ ปุ่มเลือกช่วงเวลา + ปุ่มบันทึกรูปภาพ */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2" ref={rangeMenuRef}>
        {/* ปุ่มดาวน์โหลดกราฟ */}
        <ArrowDownToLine className="text-2xl text-black dark:text-white cursor-pointer" onClick={handleCaptureScreenshot} />
        {/* ปุ่มเลือกช่วงเวลา */}
        <button
          onClick={() => setShowRangeMenu((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="เลือกช่วงเวลา"
        >
          <FaEllipsisH className="text-xl text-gray-800 dark:text-white" />
        </button>

        {showRangeMenu && (
          <div className="absolute right-0 mt-12 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg z-50">
            {[
              { label: "15 นาที", value: "15m" },
              { label: "30 นาที", value: "30m" },
              { label: "1 ชั่วโมง", value: "1h" },
              { label: "6 ชั่วโมง", value: "6h" },
              { label: "12 ชั่วโมง", value: "12h" },
              { label: "วันนี้", value: "today" },
              { label: "7 วัน", value: "7d" },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  setSelectedRange(range.value);
                  setShowRangeMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition 
            ${selectedRange === range.value
                    ? "font-bold text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"} 
            hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ✅ กราฟ */}
      <div ref={chartRef} className="w-full h-[500px]" />

      {/* ✅ คำแนะนำ */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        ✅ <strong>คำแนะนำ:</strong> คลิกชื่อก๊าซที่ด้านล่างกราฟ เพื่อเปิด/ปิดการแสดงผลของแต่ละตัว<br />
        ⚠️ ค่าก๊าซที่สูงกว่ามาตรฐานอาจส่งผลกระทบต่อสุขภาพ<br />
      </p>
    </div>
  );
};

export default LineChartGas;
