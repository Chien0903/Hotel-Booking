import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import StarRating from './StarRating'

const ReviewsList = ({ roomId }) => {

    const { axios } = useAppContext();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/reviews/room/${roomId}?page=1&limit=5`);
            
            if (data.success) {
                setReviews(data.reviews);
                setAvgRating(data.meta.avgRating);
                setTotalReviews(data.meta.total);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            // Handle error silently if no reviews yet
            if (error.response?.status !== 404) {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (roomId) {
            fetchReviews();
        }
    }, [roomId]);

    if (loading) {
        return (
            <div className='py-10'>
                <p className='text-gray-500'>Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className='mt-12 md:mt-16'>
            <h2 className='text-2xl sm:text-3xl font-playfair mb-4 sm:mb-6'>Guest Reviews</h2>

            {/* Average Rating Summary */}
            {totalReviews > 0 && (
                <div className='mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-3 sm:gap-4'>
                        <div className='flex flex-col items-center flex-shrink-0'>
                            <p className='text-3xl sm:text-4xl font-bold text-orange-500'>
                                {avgRating.toFixed(1)}
                            </p>
                            <div className='flex gap-1 mt-1 sm:mt-2'>
                                <StarRating rating={Math.round(avgRating)} />
                            </div>
                            <p className='text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2'>
                                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <div className='space-y-4 sm:space-y-6'>
                    {reviews.map((review) => (
                        <div key={review._id} className='border-b border-gray-200 pb-4 sm:pb-6'>
                            <div className='flex items-start gap-2 sm:gap-4'>
                                <img 
                                    src={review.user?.image || 'https://via.placeholder.com/48'} 
                                    alt={review.user?.username}
                                    className='w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0'
                                />
                                <div className='flex-1 min-w-0'>
                                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2 gap-1 sm:gap-0'>
                                        <p className='font-medium text-xs sm:text-sm text-gray-800 truncate'>
                                            {review.user?.username || 'Anonymous'}
                                        </p>
                                        <p className='text-xs text-gray-500 flex-shrink-0'>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    
                                    <div className='flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3'>
                                        <StarRating rating={review.rating} />
                                        <span className='text-xs sm:text-sm text-gray-600'>
                                            {review.rating}/5
                                        </span>
                                    </div>

                                    {review.comment && (
                                        <p className='text-gray-700 text-xs sm:text-sm line-clamp-4'>
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center py-8 sm:py-10'>
                    <p className='text-gray-500 text-sm sm:text-base'>
                        No reviews yet. Be the first to review this room!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;
