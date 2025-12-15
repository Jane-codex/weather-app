import type { CurrentWeather as CurrentWeatherType } from "../types/weather";
import { getSuggestion } from "../utils/suggestions";

// Icons
import { Droplets, Gauge, Wind, Sun } from "lucide-react";

interface Props {
  current: CurrentWeatherType;
  city?: string;
}

const CurrentWeather = ({ current, city }: Props) => {
  const suggestion = getSuggestion(current);

  return (
    <div className="current-weather">
      {city && <h1 className="city-name">{city}</h1>}

      

      {/* Weather Icon */}
      <img
        src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
        alt={current.weather[0].description}
      />

         <h2 className="temp-main">{current.temp}
            <span className="degree-symbol">
           °C</span></h2>

         <h3 className="weather-desc">{current.weather[0].description}</h3>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Humidity */}
        <div className="stat-card">
          <Droplets size={30} />
          <p className="label">Humidity</p>
          <p className="value">{current.humidity} %</p>
        </div>

        {/* Pressure */}
        <div className="stat-card">
          <Gauge size={30} />
          <p className="label">Pressure</p>
          <p className="value">{current.pressure} hPa</p>
        </div>

        {/* Wind Speed */}
        <div className="stat-card">
          <Wind size={30} />
          <p className="label">Wind</p>
          <p className="value">{current.wind_speed} m/s</p>
        </div>

        {/* UV Index */}
        <div className="stat-card">
          <Sun size={30} />
          <p className="label">UV Index</p>
          <p className="value">{current.uvi}</p>
        </div>
      </div>

      <p className="suggestion">💡 {suggestion}</p>
    </div>
  );
};

export default CurrentWeather;