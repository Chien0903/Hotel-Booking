import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReview,
  getReviewsByRoom,
  getReviewsByHotel,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// POST - Create a new review (protected - authenticated users only)
// reviewRouter.post("/", protect, createReview);
reviewRouter.post("/create-review",protect, createReview);

// GET - Get reviews for a specific room (public)
reviewRouter.get("/room/:roomId", getReviewsByRoom);

// GET - Get reviews for a specific hotel (public)
reviewRouter.get("/hotel/:hotelId", getReviewsByHotel);

// PUT - Update a review (protected - review owner only)
reviewRouter.put("/:reviewId", protect, updateReview);

// DELETE - Delete a review (protected - review owner or hotel owner)
reviewRouter.delete("/:reviewId", protect, deleteReview);

export default reviewRouter;
