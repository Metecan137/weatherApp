import bgTodayLarge from "../assets/images/bg-today-large.svg"
import bgTodaySmall from "../assets/images/bg-today-small.svg"
import { useSelector } from "react-redux"
import { apiLoading, error, weatherData, weatherUnits } from "../features/weatherSlice/weatherSlice"
import type { WeatherStatus } from "../types"
import sunnyIcon from "../assets/images/icon-sunny.webp"
import partlyCloudyIcon from "../assets/images/icon-partly-cloudy.webp"
import overcastIcon from "../assets/images/icon-overcast.webp"
import fogIcon from "../assets/images/icon-fog.webp"
import drizzleIcon from "../assets/images/icon-drizzle.webp"
import rainIcon from "../assets/images/icon-rain.webp"
import snowIcon from "../assets/images/icon-snow.webp"
import stormIcon from "../assets/images/icon-storm.webp"
import { useState } from "react"
import dropdownIcon from "../assets/images/icon-dropdown.svg"
import ErrorMessage from "./ErrorMessage"

function Dashboard() {
  const data = useSelector(weatherData)
  const units = useSelector(weatherUnits)
  const loading = useSelector(apiLoading)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const errorMessage = useSelector(error)
  console.log(data)

  const weatherConfig: { [key: number]: WeatherStatus } = {
    0: { label: "Clear Sky", icon: sunnyIcon },
    1: { label: "Mainly Clear", icon: partlyCloudyIcon },
    2: { label: "Partly Cloudy", icon: partlyCloudyIcon },
    3: { label: "Overcast", icon: overcastIcon },
    45: { label: "Fog", icon: fogIcon },
    48: { label: "Depositing Rime Fog", icon: fogIcon },
    51: { label: "Light Drizzle", icon: drizzleIcon },
    61: { label: "Slight Rain", icon: rainIcon },
    63: { label: "Moderate Rain", icon: rainIcon },
    65: { label: "Heavy Rain", icon: rainIcon },
    71: { label: "Slight Snow Fall", icon: snowIcon },
    95: { label: "Thunderstorm", icon: stormIcon },
  };

  const startIndex = selectedDayIndex * 24
  const endIndex = startIndex + 24

  const hourlyTimes = data?.hourly.time.slice(startIndex, endIndex) || []
  const hourlyTemps = data?.hourly.temperature_2m.slice(startIndex, endIndex) || []
  const hourlyCodes = data?.hourly.weather_code.slice(startIndex, endIndex) || []

  if (errorMessage) {
    return <ErrorMessage errorMessage={errorMessage} />
  }

  return (
    loading ? <h1 className="text-center mt-10 font-bold">...Loading</h1> :
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-10">
        <div className="md:col-span-7 flex flex-col">
          <div className="relative overflow-hidden rounded-lg min-h-75">
            {/* Masaüstü ve Geniş Tablet için Büyük Görsel */}
            <img
              src={bgTodayLarge}
              alt="bgtodaylarge"
              className="hidden sm:block w-full h-full object-cover"
            />

            {/* Mobil ve Küçük Ekranlar için Küçük Görsel */}
            <img
              src={bgTodaySmall}
              alt="bgtodaysmall"
              className="block sm:hidden w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 p-10 top-1/2 -translate-y-1/2 flex justify-between">
              <div>
                <h3 className="font-bold text-3xl">{`${data?.location.name}, ${data?.location.country}`}</h3>
                <h3 className="text-neutral-200 mt-2">{data?.current.time && new Date(data.current.time).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}</h3>
              </div>
              <div>
                <span className="text-6xl sm:text-8xl font-bold text-white italic">{`${data?.current.temperature_2m}°`}</span>
              </div>
            </div>
          </div>
          {/* 2. Alt Kısım: Detay Kartları */}
          {/* Burada tekrar grid açıyoruz ama bu sefer 4 kolonlu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
            <div className="bg-neutral-800 p-4 rounded-lg min-h-30"><h3 className="text-neutral-200">Feels Like</h3><p className="mt-4 text-white text-2xl">{`${data?.current.apparent_temperature}°`}</p></div>
            <div className="bg-neutral-800 p-4 rounded-lg min-h-30"><h3 className="text-neutral-200">Humidity</h3><p className="mt-4 text-white text-2xl">{`${data?.current.relative_humidity_2m}%`}</p></div>
            <div className="bg-neutral-800 p-4 rounded-lg min-h-30"><h3 className="text-neutral-200">Wind</h3><p className="mt-4 text-white text-2xl">{`${data?.current.wind_speed_10m} ${units.windSpeed === "kmh" ? "km/h" : "mph"}`}</p></div>
            <div className="bg-neutral-800 p-4 rounded-lg min-h-30"><h3 className="text-neutral-200">Precipitation</h3><p className="mt-4 text-white text-2xl">{`${data?.current.precipitation} ${units.precipitation === "mm" ? "mm" : "inch"}`}</p></div>
          </div>
          <div className="mt-8">
            <h1 className="font-bold">Daily Forecast</h1>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-6 mt-6">
              {/* <div className="bg-neutral-800 p-4 rounded-lg h-40"></div>*/}
              {
                data?.daily.time.map((time, index) => {
                  const day = new Date(time).toLocaleDateString('en-US', { weekday: 'short' });

                  // Diğer verilere 'index' üzerinden ulaşıyoruz
                  const maxTemp = data.daily.temperature_2m_max[index];
                  const minTemp = data.daily.temperature_2m_min[index];
                  const weatherCode = data.daily.weather_code[index];
                  const weather = weatherConfig[weatherCode] || weatherConfig[0];

                  return (
                    <div key={time} className="bg-neutral-800 p-4 rounded-lg min-h-40">
                      <h1 className="text-center">{day}</h1>
                      <img src={weather.icon} alt="weatherCode" />
                      <p className="text-center w-full">{Math.round(maxTemp)}° / {Math.round(minTemp)}°</p>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
        <div className="md:col-span-3 bg-neutral-800 p-6 rounded-2xl">
          <div className="flex flex-row md:flex-col lg:flex-row justify-between items-center mb-6">
            <h1 className="font-bold">Hourly Forecast</h1>
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-sm cursor-pointer bg-neutral-700 px-3 py-1 rounded-md flex items-center justify-center gap-2 w-28">
                {data?.hourly.time && new Date(data.daily.time[selectedDayIndex] as string).toLocaleDateString("en-US", { weekday: "long" })}
                <img src={dropdownIcon} />
              </button>
              {
                isDropdownOpen &&
                <div className="absolute text-sm right-0 w-28 mt-2 rounded-md bg-neutral-700 px-4 py-2 items-center justify-start shadow-2xl">
                  {
                    data?.daily.time.map((time, index) => (
                      <div className="border-b border-b-neutral-500 py-1 cursor-pointer" key={time} onClick={() => {
                        setSelectedDayIndex(index)
                        setIsDropdownOpen(false)
                      }}>
                        {new Date(time as string).toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                    ))
                  }
                </div>
              }
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-6 h-150 overflow-y-auto pr-2
                [&::-webkit-scrollbar]:w-1.5 
                [&::-webkit-scrollbar-track]:bg-transparent 
                [&::-webkit-scrollbar-thumb]:bg-neutral-700 
                [&::-webkit-scrollbar-thumb]:rounded-full 
                hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
            {
              hourlyTimes.map((time, index) => {
                const temp = hourlyTemps[index]
                const weatherCode = hourlyCodes[index]
                const weather = weatherConfig[weatherCode] || weatherConfig[0]

                // Saati temiz bir formata çeviriyoruz (Örn: "15:00" yerine "3 PM")
                const formattedTime = new Date(time as string).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  hour12: true
                });

                return (
                  <div key={time} className="flex justify-between items-center px-2 py-2 border-2 bg-neutral-700 rounded-lg border-neutral-700/50">
                    <div className="flex items-center gap-4">
                      <img src={weather.icon} alt={weather.label} className="w-8 h-8 object-contain" />
                      <span className="text-neutral-200 font-medium text-sm">{formattedTime}</span>
                    </div>
                    <span className="text-white font-bold text-lg">{Math.round(temp as number)}°</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
  )
}

export default Dashboard