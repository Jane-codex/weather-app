import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface WeatherMapProps {
  lat: number;
  lon: number;
  savedLocations?: { name: string; lat: number; lon: number; temp?: number; weather?: string }[];
  currentWeather?: { temp: number; description: string };
}

const getTempColor = (temp: number | undefined) => {
  if (temp === undefined) return "#999";
  if (temp <= 10) return "#1E90FF"; // cold blue
  if (temp <= 20) return "#00BFFF"; // cool
  if (temp <= 30) return "#FFA500"; // warm orange
  return "#FF4500"; // hot red
};

const getTempRadius = (temp: number | undefined) => {
  if (temp === undefined) return 5;
  return Math.min(Math.max((temp - 0) / 2 + 5, 5), 25); 
  // temp -> radius: cold=5px, hot=25px
};

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon, savedLocations = [], currentWeather }) => {
  const [apiKey] = useState(import.meta.env.VITE_OPENWEATHER_API_KEY);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="weather-map" style={{ height: "500px", width: "100%" }}>
      <MapContainer center={[lat, lon]} zoom={8} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Standard Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="Temperature">
            <TileLayer
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Clouds">
            <TileLayer
              url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`}
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Precipitation">
            <TileLayer
              url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
            />
          </LayersControl.Overlay>
        </LayersControl>

        {/* Current location */}
        <CircleMarker
          center={[lat, lon]}
          radius={getTempRadius(currentWeather?.temp)}
          color={getTempColor(currentWeather?.temp)}
          fillOpacity={0.8}
        >
          <Popup>
            <strong>Your Location</strong>
            {currentWeather && (
              <div>
                <p>{currentWeather.description}</p>
                <p>{Math.round(currentWeather.temp)}°C</p>
              </div>
            )}
          </Popup>
        </CircleMarker>

        {/* Saved locations */}
        {savedLocations.map((loc) => (
          <CircleMarker
            key={loc.name}
            center={[loc.lat, loc.lon]}
            radius={getTempRadius(loc.temp)}
            color={getTempColor(loc.temp)}
            fillOpacity={0.7}
          >
            <Popup>
              <strong>{loc.name}</strong>
              {loc.temp && <p>{Math.round(loc.temp)}°C</p>}
              {loc.weather && <p>{loc.weather}</p>}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WeatherMap;