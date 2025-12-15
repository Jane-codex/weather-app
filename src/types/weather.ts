export interface CurrentWeather {
    temp: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    weather: {
        description: string;
        icon: string;
    }[];
    uvi: number;
}


export interface DailyForecast {
    dt: number;
   temp: {
    day: number;
    min: number;
    max: number;
   };
    weather: {
        icon: string;
        description: string;
    }[];
}



export interface HourlyForecast {
    time: string;
    temp: number;
    icon: string
}


export interface WeatherResponse {
    current: CurrentWeather;
    daily: DailyForecast[];
    hourly: HourlyForecast[];
     historyTemps: number[];
    historyDates: string[];
    lat: number;
    lon: number;
    timezone: string;
   
}


