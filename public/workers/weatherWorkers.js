self.onmessage = async (event) => {
    const { location, days } = event.data;
  
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=${location}&days=${days}`);
      const data = await response.json();
  
      self.postMessage({ weather: data.current, forecast: data.forecast.forecastday });
    } catch (error) {
      console.error("❌ Worker Error:", error);
      self.postMessage({ error: "Failed to fetch weather data" });
    }
  };
  