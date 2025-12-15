import { useState, useEffect } from "react";
import { useWeather } from "../hooks/useWeather";
import CurrentWeather  from "../components/CurrentWeather";
import  Forecast from "../components/Forecast";
import WeatherMap from "../components/WeatherMap";

import SearchBar from "../components/SearchBar";
import SavedLocations from "../components/SavedLocations";
import HourlyChart from "../components/HourlyCharts";


  const Dashboard = () => {
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [city, setCity] = useState<string | null>(null);


    const [savedLocations, setSavedLocations] = useState<string[]>([]);


    // Load saved locaations from localStorage on mount
    useEffect(() => {
        const storedLocations = localStorage.getItem("savedLocations");
        if (storedLocations)
            setSavedLocations(JSON.parse(storedLocations));

        // Load last searched city
        const lastCity = localStorage.getItem("lastCity");
         if (lastCity) setCity(lastCity);
    }, []);

    
    // Geolocation on first load
    useEffect(() => {
        if (!city) {

              navigator.geolocation.getCurrentPosition((pos) => {
            setLat(pos.coords.latitude);
            setLon(pos.coords.longitude);
        });

        }
      
    }, [city]);


     // Fetch weather based on city name
       useEffect(() => {
        if (!city) return;

         const fetchCoords = async () => {
          try {
      const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    );

    if (!res.ok) {
      console.log("❌ Failed city search:", res.status);
      return;
    }

    const data = await res.json();

    if (data.length === 0) {
      console.log("❌ City not found");
      return;
    }

    // Use the first result
    const { lat, lon } = data[0];

    setLat(lat);
    setLon(lon);

    // Save city if not already saved
    if (!savedLocations.includes(city)) {
      const updatedLocations = 
      ([city, ...savedLocations].slice(0, 5));

      setSavedLocations(updatedLocations);

      localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));
    }

  } catch (err) {
    console.log("❌ City not found or network error", err);
  }
};

  fetchCoords();
}, [city]);
     

    const { data, loading, error } = useWeather(lat, lon);

    const handleCitySearch = (newCity: string) => {
        setCity(newCity);
        localStorage.setItem("lastCity", newCity);
    };


    const handleSelectSaved = (selectedCity: string) => {
        setCity(selectedCity);
    };


    const handleRemovedSaved = (cityToRemoved: string) => {
        const updatedLocations = savedLocations.filter((c) => c !== cityToRemoved)
        setSavedLocations(updatedLocations);

               
         localStorage.setItem("savedLocations", JSON.stringify(updatedLocations));

        // Removed lastCity if it matches the deleted city
        const lastCity = localStorage.getItem("lastCity");
        if (lastCity === cityToRemoved) {
           
          localStorage.removeItem("lastCity");
           setCity(null); // reset curent state
        }
    };

     
    return (
        <div className="dashboard">
           <SearchBar onSearch={handleCitySearch} />
           <SavedLocations 
           locations={savedLocations}
           onSelect={handleSelectSaved}
           onRemove={handleRemovedSaved} />


                
            {loading && <p>Loading weather...</p>}
            {error && <p>{error}</p>}
            {data && (
                <>
                <CurrentWeather current={data.current}
                city={city || "Your Location"}
                 />

                <Forecast daily={data.daily} />
                <WeatherMap lat={data.lat} lon={data.lon} />
                
                </>
            )}

             {data?.hourly && <HourlyChart hourly={data.hourly} />}

           
        </div>
    );
};

  export default Dashboard;