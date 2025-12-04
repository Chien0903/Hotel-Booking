import mongoose from "mongoose";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// Mock data for testing
export const mockTestData = {
  userId: new mongoose.Types.ObjectId(),
  userId2: new mongoose.Types.ObjectId(),
  hotelId: new mongoose.Types.ObjectId(),
  roomId: new mongoose.Types.ObjectId(),
  bookingId: new mongoose.Types.ObjectId(),
  reviewId: new mongoose.Types.ObjectId(),
};

export const createMockUser = async (userId) => {
  return await User.create({
    _id: userId,
    username: `user_${userId}`,
    email: `user_${userId}@test.com`,
    image: "https://example.com/avatar.jpg",
    role: "user",
    recentSearchedCities: [],
  });
};

export const createMockHotel = async (hotelId, ownerId) => {
  return await Hotel.create({
    _id: hotelId,
    name: "Test Hotel",
    address: "123 Test St",
    contact: "555-0123",
    owner: ownerId,
    city: "Test City",
  });
};

export const createMockRoom = async (roomId, hotelId) => {
  return await Room.create({
    _id: roomId,
    hotel: hotelId,
    roomType: "Double",
    pricePerNight: 100,
    amenities: ["WiFi", "AC", "TV"],
    images: ["image1.jpg"],
    isAvailable: true,
  });
};

export const createMockBooking = async (bookingId, userId, roomId, hotelId, checkOutDate = null) => {
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() - 5); // 5 days ago

  const checkOutDateFinal = checkOutDate || new Date();
  checkOutDateFinal.setDate(checkOutDateFinal.getDate() - 2); // 2 days ago (past checkout)

  return await Booking.create({
    _id: bookingId,
    user: userId,
    room: roomId,
    hotel: hotelId,
    checkInDate,
    checkOutDate: checkOutDateFinal,
    totalPrice: 200,
    guests: 2,
    status: "confirmed",
    paymentMethod: "Stripe",
    isPaid: true,
  });
};

export const createMockReview = async (reviewId, userId, roomId, hotelId, bookingId, rating = 5, comment = "Great stay!") => {
  return await Review.create({
    _id: reviewId,
    user: userId,
    room: roomId,
    hotel: hotelId,
    booking: bookingId,
    rating,
    comment,
  });
};

// Test suite descriptions
export const testSuites = {
  createReview: {
    success: "should create a review when user is booking owner and checkout is past",
    missingFields: "should fail with 400 if required fields are missing",
    invalidRating: "should fail with 400 if rating is not between 1-5",
    bookingNotFound: "should fail with 404 if booking does not exist",
    notBookingOwner: "should fail with 403 if user is not booking owner",
    bookingCancelled: "should fail with 403 if booking is cancelled",
    beforeCheckout: "should fail with 403 if checkout date is in the future",
    duplicateReview: "should fail with 409 if review already exists for booking",
  },
  getReviewsByRoom: {
    success: "should return paginated reviews for a room with average rating",
    emptyReviews: "should return empty reviews list if no reviews exist",
    pagination: "should respect page and limit query parameters",
  },
  getReviewsByHotel: {
    success: "should return paginated reviews for a hotel with average rating",
    emptyReviews: "should return empty reviews list if no reviews exist",
    pagination: "should respect page and limit query parameters",
  },
  updateReview: {
    success: "should update review if user is author",
    reviewNotFound: "should fail with 404 if review does not exist",
    notAuthor: "should fail with 403 if user is not review author",
    invalidRating: "should fail with 400 if new rating is not between 1-5",
  },
  deleteReview: {
    success: "should delete review if user is author",
    successHotelOwner: "should delete review if user is hotel owner",
    reviewNotFound: "should fail with 404 if review does not exist",
    notAuthorized: "should fail with 403 if user is not author or hotel owner",
  },
};
