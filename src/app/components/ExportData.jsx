import React, { useState, useEffect } from "react";
import { fetchWeather } from "@/app/serviveAPI/Weather/weatherService"; // Assuming your fetchWeather is in weatherService.js

const ExportData = ({ name, location }) => {
  const [data, setData] = useState([]); // State to hold weather data
  const [loading, setLoading] = useState(true); // State to handle loading status

  // Fetch weather data for the given location
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true while fetching data
      const weatherData = await fetchWeather(location); // Fetch weather data for the given location

      if (weatherData) {
        const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
        const weatherTime = new Date(weatherData.time)
          .toISOString()
          .split("T")[0]; // Get date from weather data

        // Only add the data if it's from today
        if (weatherTime === currentDate) {
          setData((prevData) => {
            const newData = [
              {
                time: new Date(weatherData.time).toLocaleTimeString(), // Convert to readable time
                temp: `${weatherData.temperature}°C`,
                humidity: `${weatherData.humidity}%`,
                wind: `${weatherData.wind} kph`,
              },
              ...prevData,
            ];
            // Keep only the latest 10 entries
            return newData.slice(0, 10); // Keep only the first 10 items
          });
        }
      }
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData(); // Fetch data immediately on component mount
    const intervalId = setInterval(() => {
      fetchData(); // Refetch data every 1 minute (60000 ms)
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [location]); // This effect runs when the location changes

  // Function to group data into multiple tables (e.g., by time interval of 10 minutes)
  const groupDataByInterval = (data, intervalMinutes) => {
    const groupedData = []; // Array to hold grouped data
    let currentGroup = []; // Temporary group to store items within the interval
    let lastTime = null; // Variable to store the last time

    data.forEach((item) => {
      const currentTime = new Date(item.time); // Convert item time to Date object
      if (!lastTime) {
        lastTime = currentTime; // Initialize lastTime with the first item's time
        currentGroup.push(item); // Add the first item to the group
      } else {
        const timeDifference = (currentTime - lastTime) / (1000 * 60); // Difference in minutes
        if (timeDifference >= intervalMinutes) {
          groupedData.push(currentGroup); // Add the current group as a new table
          currentGroup = [item]; // Start a new group with the current item
        } else {
          currentGroup.push(item); // Add item to the current group if within the interval
        }
        lastTime = currentTime; // Update lastTime to the current item's time
      }
    });

    // Push the last group of data if any
    if (currentGroup.length > 0) {
      groupedData.push(currentGroup);
    }

    return groupedData; // Return the grouped data
  };

  const tablesData = groupDataByInterval(data, 10); // Group data by 10-minute intervals

  return (
    <div className="p-4 border-1 mx-1 rounded-2xl bg-white flex-1">
      <h2 className="mb-4 font-semibold text-sm">{name}</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p> // Show "Loading..." while the data is being fetched
        ) : (
          // Loop through each table group and render them
          tablesData.map((tableData, tableIndex) => (
            <div key={tableIndex} className="mb-4">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Time</th>
                    <th className="px-4 py-2 border-b">Temp</th>
                    <th className="px-4 py-2 border-b">Humidity</th>
                    <th className="px-4 py-2 border-b">Wind</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="px-4 py-2">{item.time}</td>
                      <td className="px-4 py-2">{item.temp}</td>
                      <td className="px-4 py-2">{item.humidity}</td>
                      <td className="px-4 py-2">{item.wind}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExportData;
