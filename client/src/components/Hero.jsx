import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const Hero = () => {

    const { navigate, getToken, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState("");

    const onSearch = async (e) => {
        e.preventDefault();
        navigate(`/rooms?destination=${destination}`);
        // call api to save recent searched city
        await axios.post('/api/user/store-recent-search', { recentSearchedCity: destination }, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });
        // add destination to searchedCities max 3 recent searched cities
        setSearchedCities((prevSearchedCities) => {
            const updatedSearchedCities = [...prevSearchedCities, destination];
            if (updatedSearchedCities.length > 3) {
                updatedSearchedCities.shift();
            }
            return updatedSearchedCities;
        });
    }

    return (
        <div className='flex flex-col items-start justify-center px-3 sm:px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>

            <p className='bg-[#49B9FF]/50 px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full mt-16 sm:mt-20 text-xs sm:text-sm'>The Ultimate Hotel Experience</p>
            <h1 className='font-playfair text-xl sm:text-4xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-3 sm:mt-4 leading-tight'>Discover Your Perfect Gateway Destination</h1>
            <p className='max-w-130 mt-2 sm:mt-3 text-xs sm:text-sm md:text-base'>Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.</p>

            <form onSubmit={onSearch} className='bg-white text-gray-500 rounded-lg px-3 sm:px-4 md:px-6 py-3 sm:py-4 mt-6 sm:mt-8 flex flex-col md:flex-row max-md:items-start gap-3 md:gap-4 w-full md:w-auto'>

                <div className='w-full md:w-auto'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4 flex-shrink-0' />
                        <label htmlFor="destinationInput" className='text-xs sm:text-sm'>Destination</label>
                    </div>
                    <input list='destinations' onChange={e => setDestination(e.target.value)} value={destination} id="destinationInput" type="text" className="rounded border border-gray-200 px-2 sm:px-3 py-1.5 mt-1 text-xs sm:text-sm outline-none w-full" placeholder="Type here" required />
                    {/* Datalist */}
                    <datalist id="destinations">
                        {cities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                    </datalist>
                </div>

                <div className='w-full md:w-auto'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4 flex-shrink-0' />
                        <label htmlFor="checkIn" className='text-xs sm:text-sm'>Check in</label>
                    </div>
                    <input id="checkIn" type="date" className="rounded border border-gray-200 px-2 sm:px-3 py-1.5 mt-1 text-xs sm:text-sm outline-none w-full" />
                </div>

                <div className='w-full md:w-auto'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4 flex-shrink-0' />
                        <label htmlFor="checkOut" className='text-xs sm:text-sm'>Check out</label>
                    </div>
                    <input id="checkOut" type="date" className="rounded border border-gray-200 px-2 sm:px-3 py-1.5 mt-1 text-xs sm:text-sm outline-none w-full" />
                </div>

                <div className='flex md:flex-col max-md:gap-2 max-md:items-center w-full md:w-auto'>
                    <label htmlFor="guests" className='text-xs sm:text-sm'>Guests</label>
                    <input min={1} max={4} id="guests" type="number" className="rounded border border-gray-200 px-2 sm:px-3 py-1.5 mt-1 text-xs sm:text-sm outline-none w-full md:w-16" placeholder="0" />
                </div>

                <button className='flex items-center justify-center gap-1 rounded-md bg-black py-2 sm:py-3 px-3 sm:px-4 text-white md:my-auto cursor-pointer text-xs sm:text-sm' >
                    <img src={assets.searchIcon} alt="searchIcon" className='h-5 sm:h-7' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Hero