import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import ReviewForm from '../components/ReviewForm'

const MyBookings = () => {

    const { axios, getToken, user } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [bookingReviews, setBookingReviews] = useState({}); // Map of bookingId -> review
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
    const [selectedReviewForEdit, setSelectedReviewForEdit] = useState(null);


    const fetchUserBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setBookings(data.bookings)
                // Fetch reviews for each booking
                await fetchReviewsForBookings(data.bookings)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchReviewsForBookings = async (bookingsList) => {
        try {
            const reviewsMap = {}
            for (const booking of bookingsList) {
                try {
                    // Fetch reviews for this room to find if current user has reviewed
                    const { data } = await axios.get(`/api/reviews/room/${booking.room._id}?page=1&limit=100`)
                    if (data.success && data.reviews.length > 0) {
                        // Find review from current user for this booking
                        const userReview = data.reviews.find(r => r._id && r.booking === booking._id)
                        if (userReview) {
                            reviewsMap[booking._id] = userReview
                        }
                    }
                } catch (err) {
                    // Silently skip if reviews fetch fails
                }
            }
            setBookingReviews(reviewsMap)
        } catch (error) {
            console.error('Error fetching reviews:', error)
        }
    }

    const handlePayment = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                window.location.href = data.url
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const isBookingEligibleForReview = (booking) => {
        const checkoutDate = new Date(booking.checkOutDate);
        const now = new Date();
        return checkoutDate <= now && booking.status !== 'cancelled';
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        
        try {
            const { data } = await axios.delete(`/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success('Review deleted successfully')
                fetchUserBookings()
            } else {
                toast.error(data.message || 'Failed to delete review')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to delete review')
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user]);

    return (
        <div className='py-20 md:py-28 md:pb-35 md:pt-32 px-3 sm:px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />
            <div className="w-full text-gray-800 overflow-x-auto">
                <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
                    <div className="w-1/3">Hotels</div>
                    <div className="w-1/3">Date & Timings</div>
                    <div className="w-1/3">Payment</div>
                </div>

                {bookings.map((booking) => (
                    <div key={booking._id} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-4 md:py-6 first:border-t gap-3 md:gap-0">
                        <div className="flex flex-col sm:flex-row">
                            <img className="w-full sm:w-48 h-32 sm:h-40 rounded shadow object-cover flex-shrink-0" src={booking.room.images[0]} alt="hotel-img" />
                            <div className="flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-0 sm:ml-4 min-w-0">
                                <p className="font-playfair text-lg sm:text-xl md:text-2xl truncate">
                                    {booking.hotel.name}
                                    <span className="font-inter text-xs sm:text-sm"> ({booking.room.roomType})</span>
                                </p>
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 truncate">
                                    <img src={assets.locationIcon} alt="location-icon" className="flex-shrink-0" />
                                    <span className="truncate">{booking.hotel.address}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                    <img src={assets.guestsIcon} alt="guests-icon" className="flex-shrink-0" />
                                    <span>Guests: {booking.guests}</span>
                                </div>
                                <p className="text-sm sm:text-base font-medium">Total: ${booking.totalPrice}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:items-center md:gap-8 gap-3 text-sm md:text-base">
                            <div>
                                <p className="font-medium text-gray-700">Check-In:</p>
                                <p className="text-gray-500 text-xs sm:text-sm">{new Date(booking.checkInDate).toDateString()}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Check-Out:</p>
                                <p className="text-gray-500 text-xs sm:text-sm">{new Date(booking.checkOutDate).toDateString()}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-start md:justify-center pt-3 md:pt-0 gap-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full flex-shrink-0 ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                                <p className={`text-xs sm:text-sm whitespace-nowrap ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                                    {booking.isPaid ? "Paid" : "Unpaid"}
                                </p>
                            </div>
                            {!booking.isPaid && (
                                <button onClick={()=> handlePayment(booking._id)} className="px-3 py-1 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap">
                                    Pay Now
                                </button>
                            )}
                            {bookingReviews[booking._id] ? (
                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                    <button 
                                        onClick={() => setSelectedReviewForEdit(bookingReviews[booking._id])}
                                        className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all cursor-pointer whitespace-nowrap sm:flex-1"
                                    >
                                        Edit Review
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteReview(bookingReviews[booking._id]._id)}
                                        className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 transition-all cursor-pointer whitespace-nowrap sm:flex-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ) : isBookingEligibleForReview(booking) && (
                                <button 
                                    onClick={() => setSelectedBookingForReview(booking)}
                                    className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all cursor-pointer whitespace-nowrap"
                                >
                                    Write Review
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedBookingForReview && (
                <ReviewForm 
                    booking={selectedBookingForReview}
                    onReviewSubmitted={fetchUserBookings}
                    onClose={() => setSelectedBookingForReview(null)}
                />
            )}
            {selectedReviewForEdit && (
                <ReviewForm 
                    review={selectedReviewForEdit}
                    isEditMode={true}
                    onReviewSubmitted={fetchUserBookings}
                    onClose={() => setSelectedReviewForEdit(null)}
                />
            )}
        </div>
    )
}

export default MyBookings