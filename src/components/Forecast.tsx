import type { DailyForecast } from "../types/weather";
import { formatDate } from "../utils/formatDate";

interface ForecastProps {
  daily: DailyForecast[];
}

const getTempColor = (temp: number) => {
  // Simple gradient: cold blue -> warm red
  if (temp <= 10) return "#1E90FF";
  if (temp <= 20) return "#00BFFF";
  if (temp <= 30) return "#FFA500";
  return "#FF4500";
};

const Forecast: React.FC<ForecastProps> = ({ daily }) => {
  return (
    <div className="forecast-wrapper">
      <div className="forecast-grid">
        {daily.map((day) => (
          <div key={day.dt} className="card">
            <p className="date">{formatDate(day.dt)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <p className="weather-desc">{day.weather[0].description}</p>
            <p className="min-max">
              Min: {Math.round(day.temp.min)}°C / Max: {Math.round(day.temp.max)}°C
            </p>
            {/* Optional gradient bar */}
            <div
              className="temp-bar"
              style={{
                background: `linear-gradient(to top, ${getTempColor(day.temp.min)}, ${getTempColor(day.temp.max)})`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;