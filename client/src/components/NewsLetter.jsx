import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'

const NewsLetter = () => {
    return (
        <div className='flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 mx-2 lg:mx-auto my-20 sm:my-25 md:my-30 bg-gray-900 text-white'>
            <Title title="Stay Inspired" subTitle="Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration." />
            <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 w-full'>
                <input type="text" className='bg-white/10 px-3 sm:px-4 py-2 sm:py-2.5 border border-white/20 rounded outline-none text-xs sm:text-sm w-full sm:max-w-66' placeholder='Enter your email' />
                <button className='flex items-center justify-center gap-2 group bg-black px-3 sm:px-4 md:px-7 py-2 sm:py-2.5 rounded active:scale-95 transition-all text-xs sm:text-sm whitespace-nowrap'>
                    Subscribe
                    <img src={assets.arrowIcon} alt="arrow-icon" className='w-3 sm:w-3.5 invert group-hover:translate-x-1 transition-all' />
                </button>
            </div>
            <p className='text-gray-500 mt-4 sm:mt-6 text-xs text-center leading-relaxed'>By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
        </div>
    )
}

export default NewsLetter