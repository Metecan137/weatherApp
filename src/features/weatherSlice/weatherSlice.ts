import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios from "axios";
import type { WeatherData, WeatherState } from "../../types";

const initialState: WeatherState = {
    currentCity: "istanbul",
    searchDropdown: false,
    activeDropdown: null,
    loading: false,
    data: null,
    error: null,
    units: {
        temperature: "celsius",
        windSpeed: "kmh",
        precipitation: "mm",
    },
};

//sadece şehir arayan thunk dropdown için
export const searchCities = createAsyncThunk(
    "weather/searchCities",
    async (cityName: string) => {
        const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
            params: { name: cityName, count: 5, language: "en", format: "json" }
        });
        return response.data.results || [];
    }
);

export const fetchWeather = createAsyncThunk<WeatherData, { name: string; latitude: number; longitude: number; country: string; admin1?: string } | string>("weather/fetchWeather", async (cityInput, { rejectWithValue, getState }) => {
    try {

        const state = getState() as RootState
        const { temperature, windSpeed, precipitation } = state.weather.units

        // Bu değişkenler aşağıda iki farklı yoldan doldurulacak
        let latitude, longitude, name, country, admin1

        if(typeof cityInput === "string") {
            // 1. Geocoding: Şehir isminden koordinat bulma direk searche yazıp en popüleri alıyoruz
            const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
                params: {
                    name: cityInput,
                    count: 1,
                    language: "en",
                    format: "json"
                }
            })

            if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
                return rejectWithValue("City not found!")
            }

            ;({ latitude, longitude, name, country, admin1 } = geoResponse.data.results[0]) // let değerlerini destruction yaparak atadık

        } else {

            // YOL 2: Eğer obje geldiyse (dropdown'dan şehir seçildi)
            // Koordinatlar zaten dropdown'dan geliyor, geocoding'e GEREK YOK!
            // Madagaskar'ın Ankara'sını seçince onun koordinatları direkt kullanılıyor
            // Bu sayede yanlış şehir gelme sorunu çözülüyor
            ;({ latitude, longitude, name, country, admin1 } = cityInput)

        }

        // 2. Weather Forecast: Koordinatlarla gerçek hava durumunu alma
        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude,
                longitude,
                current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code",
                hourly: "temperature_2m,weather_code",
                daily: "weather_code,temperature_2m_max,temperature_2m_min",
                timezone: "auto",
                //API'ye hangi birimi istediğimizi söylüyoruz
                temperature_unit: temperature,
                wind_speed_unit: windSpeed,
                precipitation_unit: precipitation
            }
        })

        // Tasarımdaki Berlin kartı ve diğerleri için ihtiyacımız olan her şeyi döndürüyoruz
        return {
            location: { name, country, state: admin1 },
            current: weatherResponse.data.current,
            hourly: weatherResponse.data.hourly,
            daily: weatherResponse.data.daily
        }
    } catch (error: any) {
        return rejectWithValue(error.message)
    }
})

const weatherSlice = createSlice({
    name: "weather",
    initialState,
    reducers: {
        toggleDropdown: (state, action: PayloadAction<string | null>) => {
            state.activeDropdown = state.activeDropdown === action.payload ? null : action.payload
        },
        setUnit: (state, action: PayloadAction<{ category: keyof WeatherState["units"]; value: any }>) => {
            const { category, value } = action.payload;
            (state.units as any)[category] = value;
        },
        switchImperial: (state) => {
            state.units.temperature = "fahrenheit";
            state.units.windSpeed = "mph";
            state.units.precipitation = "inch";
        },
        toggleSearchDropdown: (state, action) => {
            state.searchDropdown = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                // thunk'a gönderilen ilk parametre (şehir adı) action.meta.arg içindedir
                // action.meta.arg string mi obje mi kontrol ediyoruz
                state.currentCity = typeof action.meta.arg === "string"
                    ? action.meta.arg           // string geldiyse direkt kullan
                    : action.meta.arg.name      // obje geldiyse sadece name'i al
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.error = action.payload as string
            })
    }
})

export const searchDropdown = (state: RootState) => state.weather.searchDropdown
export const city = (state: RootState) => state.weather.currentCity
export const error = (state: RootState) => state.weather.error
export const apiLoading = (state: RootState) => state.weather.loading
export const weatherData = (state: RootState) => state.weather.data
export const weatherUnits = (state: RootState) => state.weather.units
export const activeDropdown = (state: RootState) => state.weather.activeDropdown
export const { toggleDropdown, setUnit, switchImperial, toggleSearchDropdown } = weatherSlice.actions
export default weatherSlice.reducer