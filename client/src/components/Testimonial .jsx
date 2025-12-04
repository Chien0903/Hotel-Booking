import React from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import StarRating from './StarRating';

const Testimonial = () => {
    return (
        <div className='flex flex-col items-center px-3 sm:px-6 md:px-16 lg:px-24 bg-slate-50 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-25 md:pb-30'>
            <Title title="What Our Guests Say" subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world." />
            <div className='flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mt-10 sm:mt-16 md:mt-20 w-full'>
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className='w-full sm:w-[calc(50%-8px)] md:w-[calc(50%-12px)] lg:w-auto lg:max-w-96 bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow'>
                        <div className='flex items-center gap-2 sm:gap-3'>
                            <img className='w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0' src={testimonial.image} alt={testimonial.name} />
                            <div className='min-w-0'>
                                <p className='font-playfair text-base sm:text-lg md:text-xl truncate'>{testimonial.name}</p>
                                <p className='text-gray-500 text-xs sm:text-sm truncate'>{testimonial.location}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 mt-3 sm:mt-4'>
                           <StarRating />
                        </div>
                        <p className='text-gray-500 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 line-clamp-4'>"I've used many booking platforms before, but none compare to the personalized experience and attention to detail that QuickStay provides. Their curated selection of hotels is unmatched."</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonial;