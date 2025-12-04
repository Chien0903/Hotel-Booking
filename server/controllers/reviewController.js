import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import mongoose from "mongoose";

// Create a new review for a booking
export const createReview = async (req, res) => {
	try {
		const { bookingId, rating, comment } = req.body;
		console.log("req user",req.user);

		if (!bookingId || !rating) {
			return res.status(400).json({ success: false, message: "Missing required fields" });
		}

		const parsedRating = Number(rating);
		if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
			return res.status(400).json({ success: false, message: "Rating must be a number between 1 and 5" });
		}

		const booking = await Booking.findById(bookingId);
		if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

		// Only allow booking owner to review
		if (String(booking.user) !== String(req.user._id)) {
			return res.status(403).json({ success: false, message: "You are not allowed to review this booking" });
		}

		// Booking must be completed (can't review before checkout) and not cancelled
		if (booking.status === "cancelled") {
			return res.status(403).json({ success: false, message: "Cannot review a cancelled booking" });
		}

		const now = new Date();
		if (new Date(booking.checkOutDate) > now) {
			return res.status(403).json({ success: false, message: "You can only review after checkout" });
		}

		// Prevent duplicate reviews per booking
		const existing = await Review.findOne({ booking: bookingId });
		if (existing) {
			return res.status(409).json({ success: false, message: "Review for this booking already exists" });
		}

		const review = await Review.create({
			user: req.user._id,
			booking: bookingId,
			room: booking.room,
			hotel: booking.hotel,
			rating: parsedRating,
			comment,
		});

		res.json({ success: true, review });
	} catch (error) {
		console.error("createReview error:", error);
		// duplicate key error guard
		if (error.code === 11000) {
			return res.status(409).json({ success: false, message: "Review for this booking already exists" });
		}
		res.status(500).json({ success: false, message: "Failed to create review" });
	}
};

// Get reviews for a room (paginated) and average
export const getReviewsByRoom = async (req, res) => {
	try {
		const { roomId } = req.params;
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const skip = (page - 1) * limit;

		const reviews = await Review.find({ room: roomId })
			.populate("user", "username image")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Review.countDocuments({ room: roomId });

		const agg = await Review.aggregate([
			{ $match: { room: roomId } },
			{ $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
		]);

		const avgRating = agg.length ? agg[0].avgRating : 0;

		res.json({ success: true, reviews, meta: { total, page, limit, avgRating } });
	} catch (error) {
		console.error("getReviewsByRoom error:", error);
		res.status(500).json({ success: false, message: "Failed to fetch reviews" });
	}
};

// Get reviews for a hotel (paginated) and average
export const getReviewsByHotel = async (req, res) => {
	try {
		const { hotelId } = req.params;
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 10;
		const skip = (page - 1) * limit;

		const reviews = await Review.find({ hotel: hotelId })
			.populate("user", "username image")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Review.countDocuments({ hotel: hotelId });

		const agg = await Review.aggregate([
			{ $match: { hotel: hotelId } },
			{ $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
		]);

		const avgRating = agg.length ? agg[0].avgRating : 0;

		res.json({ success: true, reviews, meta: { total, page, limit, avgRating } });
	} catch (error) {
		console.error("getReviewsByHotel error:", error);
		res.status(500).json({ success: false, message: "Failed to fetch hotel reviews" });
	}
};

// Update a review (only by author)
export const updateReview = async (req, res) => {
	try {
		const { reviewId } = req.params;
		const { rating, comment } = req.body;

		const review = await Review.findById(reviewId);
		if (!review) return res.status(404).json({ success: false, message: "Review not found" });

		if (String(review.user) !== String(req.user._id)) {
			return res.status(403).json({ success: false, message: "Not authorized to update this review" });
		}

		if (rating !== undefined) {
			const parsedRating = Number(rating);
			if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
				return res.status(400).json({ success: false, message: "Rating must be a number between 1 and 5" });
			}
			review.rating = parsedRating;
		}

		if (comment !== undefined) review.comment = comment;

		await review.save();

		res.json({ success: true, review });
	} catch (error) {
		console.error("updateReview error:", error);
		res.status(500).json({ success: false, message: "Failed to update review" });
	}
};

// Delete a review (author or hotel owner can delete)
export const deleteReview = async (req, res) => {
	try {
		const { reviewId } = req.params;

		const review = await Review.findById(reviewId);
		if (!review) return res.status(404).json({ success: false, message: "Review not found" });

		// if user is author
		if (String(review.user) === String(req.user._id)) {
			await review.remove();
			return res.json({ success: true, message: "Review deleted" });
		}

		// if user is hotel owner
		if (review.hotel) {
			const hotel = await Hotel.findById(review.hotel);
			if (hotel && String(hotel.owner) === String(req.user._id)) {
				await review.remove();
				return res.json({ success: true, message: "Review deleted by hotel owner" });
			}
		}

		return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
	} catch (error) {
		console.error("deleteReview error:", error);
		res.status(500).json({ success: false, message: "Failed to delete review" });
	}
};

export default {
	createReview,
	getReviewsByRoom,
	getReviewsByHotel,
	updateReview,
	deleteReview,
};
