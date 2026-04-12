import search from "../assets/images/icon-search.svg"
import { useForm, type SubmitHandler } from "react-hook-form"
import { type Inputs } from "../types"
import { fetchWeather } from "../features/weatherSlice/weatherSlice"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../features/store"

function Search() {
    const {register, handleSubmit} = useForm<Inputs>()
    const dispatch = useDispatch<AppDispatch>()
    const onSubmit: SubmitHandler<Inputs> = (data) => dispatch(fetchWeather(data.search))

    return (
        <main>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center mt-12 w-full max-w-2xl mx-auto">
                    <h1 className="font-display font-bold text-5xl text-center">How's the sky looking today?</h1>
                    <div className="flex flex-col md:flex-row w-full max-w-145 mt-12">
                        <div className="relative md:flex-4 w-full">
                            <img src={search} alt="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-auto h-4 opacity-50 pointer-events-none" />
                            <input {...register("search")} type="text" placeholder="Search for a place..." className="bg-neutral-800 rounded-lg w-full h-12 px-10 pr-4 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all" />
                        </div>
                        <button type="submit" className="submit bg-blue-500 md:flex-1 rounded-lg md:ml-3 w-full mt-2 md:mt-0 h-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all">Search</button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default Search