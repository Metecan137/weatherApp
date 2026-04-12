export interface WeatherData {
    location: {
        name: string;
        country: string;
        state: string;
    };
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        wind_speed_10m: number;
        weather_code: number;
        time: string
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        weather_code: number[];
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

export interface WeatherState {
    activeDropdown: string | null
    loading: boolean
    data: WeatherData | null
    error: string | null
    units: {
        temperature: "celsius" | "fahrenheit";
        windSpeed: "kmh" | "mph";
        precipitation: "mm" | "inch";
    };
}

export interface Inputs {
    search: string
}

export interface WeatherStatus {
    label: string;
    icon: string;
}