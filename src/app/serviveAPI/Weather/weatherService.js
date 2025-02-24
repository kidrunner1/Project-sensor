const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";

export const fetchWeather = async (location, days = 7) => {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

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
    console.log("✅ Forecast Days:", data.forecast.forecastday.length); // 🔍 Debug ดูว่า API คืนมากี่วัน

    return {
      current: {
        time: data?.location?.localtime || "Unknown",
        temperature: data?.current?.temp_c || 0,
        humidity: data?.current?.humidity || 0,
        wind: data?.current?.wind_kph || 0,
        condition: data?.current?.condition?.text || "Unknown",
        icon: data?.current?.condition?.icon ? `https:${data.current.condition.icon}` : "",
      },
      forecast: (data?.forecast?.forecastday || []).map((day) => ({
        date: day.date || "N/A",
        dayName: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
        icon: day?.day?.condition?.icon ? `https:${day.day.condition.icon}` : "",
        tempMax: day?.day?.maxtemp_c || 0,
        tempMin: day?.day?.mintemp_c || 0,
        chanceOfRain: day?.day?.daily_chance_of_rain || 0,
      })),
    };

  } catch (error) {
    console.error("❌ Error fetching weather data:", error);
    return null;
  }
};
