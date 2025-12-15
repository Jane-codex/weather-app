import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { WeatherResponse, DailyForecast } from "../types/weather";

export const useWeather = (lat: number | null, lon: number | null) => {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
;


  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      setLoading(true);

      try {
        // 1️⃣ Current weather
        const currentRes = await api.get("data/2.5/weather", {
          params: { lat, lon, units: "metric" },
        });

        // 2️⃣ 5-day / 3-hour forecast
        const forecastRes = await api.get("data/2.5/forecast", {
          params: { lat, lon, units: "metric" },
        });

        // 3️⃣ Map forecast into daily min/max
        const dailyMap: Record<string, number[]> = {};
        forecastRes.data.list.forEach((item: any) => {
          const date = item.dt_txt.split(" ")[0]; // YYYY-MM-DD
          if (!dailyMap[date]) dailyMap[date] = [];
          dailyMap[date].push(item.main.temp);
        });

        // 3️⃣ Hourly forecast (next 24 hours)
    const hourly = forecastRes.data.list
  .slice(0, 8) // next 24 hours (3h × 8)
  .map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
     /*  hour12: true, */
    }),
    temp: item.main.temp,
    icon: item.weather[0].icon,
    }));

        // Sort dates
        const sortedDates = Object.keys(dailyMap).sort();

        // Today timestamp at midnight
        const todayTimestamp = new Date().setHours(0, 0, 0, 0);

        // Map daily forecast, filter past dates
        const daily: DailyForecast[] = sortedDates
          .map(date => {
            const temps = dailyMap[date];

            // Pick weather closest to 12:00
            const sampleWeather = forecastRes.data.list
              .filter((i: any) => i.dt_txt.startsWith(date))
              .reduce((prev: any, curr: any) => {
                const targetHour = 12;
                return Math.abs(new Date(curr.dt_txt).getHours() - targetHour) <
                       Math.abs(new Date(prev.dt_txt).getHours() - targetHour)
                       ? curr
                       : prev;
              });

            return {
              dt: Math.floor(new Date(date).getTime() / 1000),
              temp: {
                day: temps[Math.floor(temps.length / 2)],
                min: Math.min(...temps),
                max: Math.max(...temps),
              },
              weather: [
                {
                  icon: sampleWeather?.weather[0]?.icon || "01d",
                  description: sampleWeather?.weather[0]?.description || "",
                },
              ],
            };
          })
          .filter(d => d.dt * 1000 >= todayTimestamp) // remove past dates
          .slice(0, 5); // today + next 4 days

        // 4️⃣ Local history (last 5 days)
        const historyTemps: number[] = JSON.parse(
          localStorage.getItem("historyTemps") || "[]"
        );
        const historyDates: string[] = JSON.parse(
          localStorage.getItem("historyDates") || "[]"
        );

        const todayTemp = currentRes.data.main.temp;
        const todayDate = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (!historyDates.includes(todayDate)) {
          historyTemps.unshift(todayTemp);
          historyDates.unshift(todayDate);
        }

        const trimmedTemps = historyTemps.slice(0, 5);
        const trimmedDates = historyDates.slice(0, 5);

        localStorage.setItem("historyTemps", JSON.stringify(trimmedTemps));
        localStorage.setItem("historyDates", JSON.stringify(trimmedDates));

        // 5️⃣ Set data
        setData({
          current: {
            temp: currentRes.data.main.temp,
            humidity: currentRes.data.main.humidity,
            pressure: currentRes.data.main.pressure,
            wind_speed: currentRes.data.wind.speed,
            weather: currentRes.data.weather.map((w: any) => ({
              description: w.description,
              icon: w.icon,
            })),
            uvi: 0, // free plan fallback
          },
          daily,
          hourly,
          historyTemps: trimmedTemps,
          historyDates: trimmedDates,
          lat,
          lon,
          timezone: forecastRes.data.city?.timezone || "Unknown",
        });

      } catch (err) {
        console.error(err);
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { data, loading, error };
};