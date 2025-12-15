import type { CurrentWeather } from "../types/weather";


export const getSuggestion = (current: CurrentWeather) => {
     const temp = current.temp;
     const desc = current.weather[0].description;

     if (temp > 30) return "It's hot today stay hydrated!";

     if (temp < 15) return "A bit cold consider wearing something warm.";

     if (desc.includes("rain")) return "Rain expected carry an umbrella.";

     if (desc.includes("strom")) return "Storm alert stay safe!";

     if (current.uvi > 7) return "UV is high wear sunscreen!";

     return "Weather looks good today ⛅";
     
};