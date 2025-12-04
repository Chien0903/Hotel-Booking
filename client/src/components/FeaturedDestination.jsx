import React from 'react'
import { useAppContext } from '../context/AppContext';
import Title from './Title';
import HotelCard from './HotelCard';


const FeaturedDestination = () => {
    const { rooms, navigate } = useAppContext();
    return rooms.length > 0 && (
        <div className='flex flex-col items-center px-3 sm:px-6 md:px-16 lg:px-24 bg-slate-50 py-12 sm:py-16 md:py-20'>
            <Title title="Featured Destination" subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences." />
            <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-12 sm:mt-16 md:mt-20 w-full'>
                {rooms.slice(0, 4).map((room, index) => (
                    <div key={room._id} className='w-full sm:w-[calc(50%-8px)] md:w-[calc(50%-12px)] lg:w-auto'>
                        <HotelCard room={room} index={index} />
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='my-10 sm:my-12 md:my-16 px-4 py-2 text-xs sm:text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination