import React, { useState, useEffect } from "react";
import { fetchWeather } from "../weatherService"; // Assuming your fetchWeather is in weatherService.js

const ExportData = ({ name, location }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch weather data for the given location
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const weatherData = await fetchWeather(location); // Pass location
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
      setLoading(false);
    };

    fetchData(); // Fetch data immediately
    const intervalId = setInterval(() => {
      fetchData(); // Refetch data every 1 minute (60000 ms)
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [location]);

  // Function to group data by 10-minute intervals
  const groupByTenMinutes = (data) => {
    const groupedData = [];
    let lastTime = null;

    data.forEach((item) => {
      const currentTime = new Date(item.time);
      if (!lastTime) {
        lastTime = currentTime;
        groupedData.push(item);
      } else {
        const timeDifference = (currentTime - lastTime) / (1000 * 60); // Difference in minutes
        if (timeDifference >= 10) {
          groupedData.push(item);
          lastTime = currentTime;
        }
      }
    });

    return groupedData;
  };

  const groupedData = groupByTenMinutes(data);

  return (
    <div className="p-4 border-1 mx-1 rounded-2xl bg-white flex-1 h-[300px]">
      <h2 className="mb-4 font-semibold text-sm">{name}</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
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
              {groupedData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="px-4 py-2">{item.time}</td>
                  <td className="px-4 py-2">{item.temp}</td>
                  <td className="px-4 py-2">{item.humidity}</td>
                  <td className="px-4 py-2">{item.wind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExportData;
