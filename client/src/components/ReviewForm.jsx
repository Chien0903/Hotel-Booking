import React, { useState } from 'react'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const ReviewForm = ({ booking, onReviewSubmitted, onClose }) => {

    const { axios, getToken } = useAppContext();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStarClick = (starIndex) => {
        setRating(starIndex + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const { data } = await axios.post('/api/reviews/create-review', 
                {
                    bookingId: booking._id,
                    rating,
                    comment,
                },
                {
                    headers: { Authorization: `Bearer ${await getToken()}` }
                }
            );

            if (data.success) {
                toast.success('Review submitted successfully!');
                onReviewSubmitted();
                onClose();
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg shadow-lg max-w-md w-full p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-playfair'>Write a Review</h2>
                    <button 
                        onClick={onClose} 
                        className='text-gray-500 hover:text-gray-700 text-2xl'
                    >
                        ×
                    </button>
                </div>

                <div className='mb-4'>
                    <p className='text-sm text-gray-600 mb-2'>
                        Hotel: <span className='font-medium'>{booking.hotel.name}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Star Rating Selection */}
                    <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Rating
                        </label>
                        <div className='flex gap-2'>
                            {Array(5).fill('').map((_, index) => (
                                <button
                                    key={index}
                                    type='button'
                                    onClick={() => handleStarClick(index)}
                                    className='cursor-pointer hover:scale-110 transition-transform'
                                >
                                    <img 
                                        src={rating > index ? assets.starIconFilled : assets.starIconOutlined}
                                        alt={`star-${index}`}
                                        className='w-8 h-8'
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className='text-xs text-gray-500 mt-2'>
                                {rating} out of 5 stars
                            </p>
                        )}
                    </div>

                    {/* Comment Field */}
                    <div className='mb-6'>
                        <label htmlFor='comment' className='block text-sm font-medium text-gray-700 mb-2'>
                            Your Review (Optional)
                        </label>
                        <textarea
                            id='comment'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            placeholder='Share your experience...'
                            className='w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-500 resize-none'
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                            {comment.length}/1000
                        </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className='flex gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-all'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={isSubmitting || !rating}
                            className='flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
