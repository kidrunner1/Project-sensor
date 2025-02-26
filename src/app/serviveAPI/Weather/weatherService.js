const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

const MAX_RETRIES = 3; // 🔄 ลองใหม่สูงสุด 3 ครั้ง
const RETRY_DELAY_BASE = 500; // ⏳ หน่วงเวลาเริ่มต้น 500ms
const CIRCUIT_BREAKER_THRESHOLD = 5; // 🚨 ถ้า API ล้มเหลว 5 ครั้งติด หยุดเรียกชั่วคราว
const CIRCUIT_BREAKER_TIMEOUT = 30000; // ⏳ ปิด API 30 วินาทีเมื่อ Circuit Breaker ทำงาน

let circuitBreakerFailures = 0;
let circuitBreakerOpen = false;

export const fetchWeather = async (location, days = 7) => {
  if (!API_KEY) {
    console.error("❌ Weather API key is missing.");
    return null;
  }

  if (circuitBreakerOpen) {
    console.warn("⚠️ Circuit Breaker Active: Skipping API call");
    return null;
  }

  let attempt = 0;
  let success = false;
  let data = null;
  let remainingRequests = null;

  while (attempt < MAX_RETRIES && !success) {
    attempt++;
    try {
      console.log(`🌎 Fetching weather data for ${location} (Attempt ${attempt}/${MAX_RETRIES})`);

      const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${location}&days=${days}&aqi=no&alerts=no`);

      // ✅ ตรวจสอบ Rate Limit
      remainingRequests = response.headers.get("X-Ratelimit-Remaining");

      if (remainingRequests !== null) {
        console.log(`🔢 API Rate Limit Remaining: ${remainingRequests}`);
        if (parseInt(remainingRequests, 10) <= 0) {
          console.warn("⚠️ API Rate Limit Exceeded. Skipping request.");
          return null;
        }
      }

      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${response.statusText}`);
      }

      data = await response.json();
      success = true;

      console.log(`✅ Success! Forecast Days: ${data.forecast.forecastday.length}`);

      // ✅ Reset Circuit Breaker เมื่อ API ใช้งานได้ปกติ
      circuitBreakerFailures = 0;
      return formatWeatherData(data);

    } catch (error) {
      console.error(`🚨 Fetch attempt ${attempt} failed:`, error.message);

      if (attempt < MAX_RETRIES) {
        const retryDelay = RETRY_DELAY_BASE * 2 ** (attempt - 1);
        console.log(`🔁 Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        console.error("❌ Max retry attempts reached. Logging failure.");

        circuitBreakerFailures++;

        if (circuitBreakerFailures >= CIRCUIT_BREAKER_THRESHOLD) {
          activateCircuitBreaker();
        }

        return null;
      }
    }
  }

  return null;
};

// ✅ ฟังก์ชันจัดรูปแบบข้อมูลให้อ่านง่ายขึ้น
const formatWeatherData = (data) => ({
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
});

// ✅ ฟังก์ชันเปิดใช้งาน Circuit Breaker
const activateCircuitBreaker = () => {
  circuitBreakerOpen = true;
  console.error(`🚨 Circuit Breaker Activated! Blocking API calls for ${CIRCUIT_BREAKER_TIMEOUT / 1000} seconds.`);

  setTimeout(() => {
    circuitBreakerOpen = false;
    console.log("✅ Circuit Breaker Reset. API calls resumed.");
  }, CIRCUIT_BREAKER_TIMEOUT);
};
