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
        <div className='mt-16'>
            <h2 className='text-3xl font-playfair mb-6'>Guest Reviews</h2>

            {/* Average Rating Summary */}
            {totalReviews > 0 && (
                <div className='mb-8 p-4 bg-gray-50 rounded-lg'>
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-center'>
                            <p className='text-4xl font-bold text-orange-500'>
                                {avgRating.toFixed(1)}
                            </p>
                            <div className='flex gap-1 mt-2'>
                                <StarRating rating={Math.round(avgRating)} />
                            </div>
                            <p className='text-sm text-gray-600 mt-2'>
                                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <div className='space-y-6'>
                    {reviews.map((review) => (
                        <div key={review._id} className='border-b border-gray-200 pb-6'>
                            <div className='flex items-start gap-4'>
                                <img 
                                    src={review.user?.image || 'https://via.placeholder.com/48'} 
                                    alt={review.user?.username}
                                    className='w-12 h-12 rounded-full object-cover'
                                />
                                <div className='flex-1'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <p className='font-medium text-gray-800'>
                                            {review.user?.username || 'Anonymous'}
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    
                                    <div className='flex items-center gap-2 mb-3'>
                                        <StarRating rating={review.rating} />
                                        <span className='text-sm text-gray-600'>
                                            {review.rating}/5
                                        </span>
                                    </div>

                                    {review.comment && (
                                        <p className='text-gray-700 text-sm'>
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center py-10'>
                    <p className='text-gray-500'>
                        No reviews yet. Be the first to review this room!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;
