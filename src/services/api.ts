import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const api = axios.create({
  baseURL: "https://api.openweathermap.org/",
  params: {
    appid: API_KEY,
    units: "metric",
  },
});