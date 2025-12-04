import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { exclusiveOffers } from '../assets/assets'

const ExclusiveOffers = () => {
    return (
        <div className='flex flex-col items-center px-3 sm:px-6 md:px-16 lg:px-24 xl:px-32 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-25 md:pb-30'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4'>
                <Title align='left' title="Exclusive Offers" subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories." />
                <button className='group flex items-center gap-2 font-medium cursor-pointer whitespace-nowrap text-sm md:text-base'>
                    View All Offers
                    <img className='group-hover:translate-x-1 transition-all h-4 md:h-5' src={assets.arrowIcon} alt="arrow-icon" />
                </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-10 md:mt-12 w-full'>
                {exclusiveOffers.map((item) => (
                    <div key={item._id} className='group relative flex flex-col items-start justify-between gap-1 pt-10 sm:pt-12 md:pt-18 px-3 sm:px-4 py-4 h-40 sm:h-48 md:h-56 rounded-xl text-white bg-no-repeat bg-cover bg-center' style={{ backgroundImage: `url(${item.image})` }}>
                        <p className='px-2 sm:px-3 py-0.5 sm:py-1 absolute top-2 sm:top-4 left-2 sm:left-4 text-xs bg-white text-gray-800 font-medium rounded-full'>
                            {item.priceOff}% OFF
                        </p>
                        <div className='flex-1 flex flex-col justify-end'>
                            <p className='text-lg sm:text-xl md:text-2xl font-medium font-playfair truncate'>{item.title}</p>
                            <p className='text-xs sm:text-sm line-clamp-2'>{item.description}</p>
                            <p className='text-xs text-white/70 mt-2'>Expires {item.expiryDate}</p>
                        </div>
                        <button className='flex items-center gap-2 font-medium cursor-pointer mt-2 mb-2 text-xs sm:text-sm'>
                            View Offers
                            <img className='invert group-hover:translate-x-1 transition-all h-3 sm:h-4' src={assets.arrowIcon} alt="arrow-icon" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExclusiveOffers