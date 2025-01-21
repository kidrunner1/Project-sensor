"use client";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const WindRoseChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between ">
        <h1 className="text-lg font-semibold">ทิศทาง</h1>
        <Image src="/images/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-white text-lg font-semibold mb-4 text-center">
        Wind Rose Chart
      </h1>
      <Plot
        data={[
          {
            type: "barpolar",
            r: [30, 20, 15, 10, 5, 15, 20, 25], // Frequency or intensity
            theta: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], // Compass directions
            width: [10, 10, 10, 10, 10, 10, 10, 10], // Sector width
            marker: {
              color: [
                "#4575b4",
                "#91bfdb",
                "#e0f3f8",
                "#fee090",
                "#fc8d59",
                "#d73027",
                "#91bfdb",
                "#4575b4",
              ], // Color mapping
              line: { color: "black", width: 1 }, // Border styling
            },
            name: "Wind speed (m/s)", // Legend title
          },
        ]}
        layout={{
          polar: {
            angularaxis: {
              direction: "clockwise", // Clockwise rotation
              rotation: 90, // North at the top
              tickmode: "array",
              tickvals: [0, 45, 90, 135, 180, 225, 270, 315],
              ticktext: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
              ticks: "outside",
              ticklen: 10,
              tickcolor: "white",
            },
            radialaxis: {
              visible: true,
              range: [0, 30], // Adjust range as needed
              showline: true,
              gridcolor: "#444", // Grid line color
            },
          },
          legend: {
            title: { text: "Wind speed (m/s)", font: { color: "white" } },
            font: { color: "white" },
          },
          paper_bgcolor: "#000", // Chart background color
          plot_bgcolor: "#000", // Chart plot area color
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default WindRoseChart;
