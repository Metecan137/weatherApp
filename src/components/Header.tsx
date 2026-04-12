import logo from "../assets/images/logo.svg"
import iconUnits from "../assets/images/icon-units.svg"
import dropdownIcon from "../assets/images/icon-dropdown.svg"
import { activeDropdown, setUnit, toggleDropdown, weatherUnits } from "../features/weatherSlice/weatherSlice"
import { useDispatch, useSelector } from "react-redux"
import checkmark from "../assets/images/icon-checkmark.svg"
import { useEffect } from "react"
import { fetchWeather } from "../features/weatherSlice/weatherSlice"
import type { AppDispatch } from "../features/store"

function Header() {
    const dispatch = useDispatch<AppDispatch>()
    const dropdown = useSelector(activeDropdown)
    const units = useSelector(weatherUnits)

    useEffect(() => {
        dispatch(fetchWeather("istanbul"));
    }, [dispatch, units]);

    return (
        <div className="flex justify-between w-full items-center">
            <img src={logo} alt="Logo" />
            <div className="relative text-sm" onClick={(e) => e.stopPropagation()}>
                <button className="flex items-center justify-center cursor-pointer gap-2 bg-neutral-800 p-2 rounded-lg border border-transparent focus-visible:border-neutral-0 focus:outline-none transition-all"
                    onClick={() => dispatch(toggleDropdown("units"))}>
                    <img src={iconUnits} alt="iconUnits" />Units
                    <img src={dropdownIcon} alt="dropdownIcon" />
                </button>
                {
                    dropdown === "units" &&
                    <div className="absolute top-full right-0 w-48 p-1 bg-neutral-800 rounded-lg mt-2 z-50">
                        <button className="w-full text-left p-2 cursor-pointer rounded-md border border-transparent focus:border-neutral-400 focus:outline-none transition-all"
                            onClick={() => {
                                dispatch(setUnit({ category: "temperature", value: "fahrenheit" }))
                                dispatch(setUnit({ category: "windSpeed", value: "mph" }))
                                dispatch(setUnit({ category: "precipitation", value: "inch" }))
                            }}>
                            Switch to Imperial
                        </button>
                        <div className="border-b border-neutral-500">
                            <h2 className="text-xs opacity-50 mt-1 p-2">Temperature</h2>
                            <p className={`flex justify-between mt-1 hover:bg-neutral-700 px-2 pt-1 pb-2 rounded-md ${units.temperature === "celsius" ? "bg-neutral-700" : ""}`}
                                onClick={() => dispatch(setUnit({ category: "temperature", value: "celsius" }))}><span>Celsius (°C)</span> {units.temperature === "celsius" && <img src={checkmark} alt="checkmark" />}</p>
                            <p className={`flex justify-between mt-1 mb-2 px-2 pt-1 pb-2 hover:bg-neutral-700 rounded-md ${units.temperature === "fahrenheit" ? "bg-neutral-700" : ""}`}
                                onClick={() => dispatch(setUnit({ category: "temperature", value: "fahrenheit" }))}><span>Fahrenheit (°F)</span> {units.temperature === "fahrenheit" && <img src={checkmark} alt="checkmark" />}</p>
                        </div>
                        <div className="border-b border-neutral-500">
                            <h2 className="text-xs opacity-50 mt-1 p-2">Wind Speed</h2>
                            <p className={`flex justify-between mt-1 px-2 pt-1 pb-2 hover:bg-neutral-700 rounded-md ${units.windSpeed === "kmh" ? "bg-neutral-700" : ""}`}
                                onClick={() => dispatch(setUnit({ category: "windSpeed", value: "kmh" }))}><span>km/h</span> {units.windSpeed === "kmh" && <img src={checkmark} alt="checkmark" />}</p>
                            <p className={`flex justify-between mt-1 mb-2 px-2 pt-1 pb-2 hover:bg-neutral-700 rounded-md ${units.windSpeed === "mph" ? "bg-neutral-700" : ""}`}
                                onClick={() => dispatch(setUnit({ category: "windSpeed", value: "mph" }))}><span>mph</span> {units.windSpeed === "mph" && <img src={checkmark} alt="checkmark" />}</p>
                        </div>
                        <div>
                            <h2 className="text-xs opacity-50 mt-1 p-2">Precipitation</h2>
                            <p className={`flex justify-between mt-1 px-2 pt-1 pb-2 hover:bg-neutral-700 rounded-md ${units.precipitation === "mm" ? "bg-neutral-700" : ""}`}
                                onClick={() => dispatch(setUnit({ category: "precipitation", value: "mm" }))}><span>Millimeters (mm)</span> {units.precipitation === "mm" && <img src={checkmark} alt="checkmark" />}</p>
                            <p className={`flex justify-between mt-1 mb-2 px-2 pt-1 pb-2 hover:bg-neutral-700 rounded-md ${units.precipitation === "inch" ? "bg-neutral-700" : ""}`}
                                onClick={() => dispatch(setUnit({ category: "precipitation", value: "inch" }))}><span>Inches (in)</span> {units.precipitation === "inch" && <img src={checkmark} alt="checkmark" />}</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Header