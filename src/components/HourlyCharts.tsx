import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export interface HourlyItem {
  time: string;
  temp: number;
  icon: string;
}

interface HourlyChartProps {
  hourly: HourlyItem[];
}

const HourlyChart: React.FC<HourlyChartProps> = ({ hourly }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="hourly-card">
      <h3 className="hourly-title">Hourly Forecast</h3>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={hourly}
          margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9800" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ff9800" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Axis */}
          <XAxis
            dataKey="time"
            tick={{ fill: "#0e3181", fontSize: 12, fontWeight: "Bold" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#0e3181", fontSize: 13, fontWeight: "Bold" }}
            axisLine={false}
            tickLine={false}
            unit="°C"
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #eee",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number) => `${value}°C`}
          />

          {/* Smooth curved line */}
          <Area
            type="monotone"
            dataKey="temp"
            stroke="#ff9800"
            strokeWidth={3}
            fill="url(#tempGradient)"
            dot={{ r: 4, fill: "#ff9800" }}
            activeDot={{ r: 6 }}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Icons row */}
      <div className="hourly-icons">
        {hourly.map((h, i) => (
          <div key={i} className="hourly-icon">
            <img
              src={`https://openweathermap.org/img/wn/${h.icon}@2x.png`}
              alt="weather-icon"
            />
            <span>{h.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyChart;