import search from "../assets/images/icon-search.svg"
import { useForm, type SubmitHandler } from "react-hook-form"
import { type Inputs } from "../types"
import { fetchWeather, searchCities, searchDropdown, toggleSearchDropdown } from "../features/weatherSlice/weatherSlice"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../features/store"
import { useEffect } from "react"
import { useState } from "react"

function Search() {
    const {register, handleSubmit, watch, setValue} = useForm<Inputs>()
    const dropdown = useSelector(searchDropdown)
    const searchValue = watch("search")
    const dispatch = useDispatch<AppDispatch>()
    const [searchResults, setSearchResults] = useState<any[]>([]); // Yerel state daha pratik olabilir
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        dispatch(fetchWeather(data.search))
    }

    console.log(dropdown)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue && searchValue.length > 2) {
                dispatch(searchCities(searchValue)).then((res: any) => {
                    setSearchResults(res.payload);
                });
            } else {
                setSearchResults([]);
            }
        }, 200); // Debounce: Kullanıcı yazmayı bitirince istek atar
        return () => clearTimeout(timer);
    }, [searchValue, dispatch]);

    const handleSelectCity = (city: any) => {
        // Seçilen şehri fetch et ve input'u temizle/güncelle
        dispatch(fetchWeather(city.name));
        setSearchResults([]);
        setValue("search", city.name);
    };

    return (
        <main>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center mt-12 w-full max-w-2xl mx-auto">
                    <h1 className="font-display font-bold text-5xl text-center">How's the sky looking today?</h1>
                    <div className="flex flex-col md:flex-row w-full max-w-145 mt-12">
                        <div className="relative md:flex-4 w-full">
                            <img src={search} alt="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-auto h-4 opacity-50 pointer-events-none" />
                            <input {...register("search")} type="text" placeholder="Search for a place..." className="bg-neutral-800 rounded-lg w-full h-12 px-10 pr-4 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all" 
                            onClick={(e) => {
                                e.stopPropagation()
                                dispatch(toggleSearchDropdown(true))
                                }}/>
                            {dropdown && 
                                <div className={`absolute w-full bg-neutral-800 rounded-lg mt-2 px-10 min-h-0 z-50`}>
                                {
                                    searchResults?.map((item:any, index:any) => (
                                        <div key={index} className="mt-2 text-neutral-200 font-semibold py-2" 
                                        onClick={(e) => {
                                                e.stopPropagation()
                                                handleSelectCity(item)
                                                dispatch(toggleSearchDropdown(false))
                                            }}>{`${item.name}, ${item.country}`}
                                        </div>
                                    ))
                                }
                            </div>
                            }
                        </div>
                        <button type="submit" className="submit bg-blue-500 md:flex-1 rounded-lg md:ml-3 w-full mt-2 md:mt-0 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all">Search</button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default Search