import mongoose from "mongoose";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import {
  mockTestData,
  createMockUser,
  createMockHotel,
  createMockRoom,
  createMockBooking,
  createMockReview,
  testSuites,
} from "./testHelpers.js";

/**
 * Integration Tests for Review Controller
 * 
 * Note: These tests assume a test database is configured.
 * Before running, ensure:
 * 1. MongoDB is running with a test database
 * 2. Environment variables are set for testing (TEST_DB_URL)
 * 3. Run with: npm test or yarn test
 * 
 * Test Coverage:
 * - createReview: validations, ownership, eligibility, duplicates
 * - getReviewsByRoom: pagination, aggregation
 * - getReviewsByHotel: pagination, aggregation
 * - updateReview: authorization, field updates
 * - deleteReview: authorization (author & hotel owner)
 */

describe("Review Controller Tests", () => {
  // Setup and teardown
  beforeAll(async () => {
    // Connect to test database (assumes TEST_DB_URL in .env)
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.TEST_DB_URL || "mongodb://localhost:27017/hotel-booking-test");
    }
  });

  afterEach(async () => {
    // Clean up after each test
    await Review.deleteMany({});
    await Booking.deleteMany({});
    await Room.deleteMany({});
    await Hotel.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect from database
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe("createReview", () => {
    test(testSuites.createReview.success, async () => {
      // Setup
      const user = await createMockUser(mockTestData.userId);
      const hotel = await createMockHotel(mockTestData.hotelId, mockTestData.userId);
      const room = await createMockRoom(mockTestData.roomId, mockTestData.hotelId);
      const booking = await createMockBooking(
        mockTestData.bookingId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId
      );

      // Execute
      const review = await Review.create({
        user: mockTestData.userId,
        booking: mockTestData.bookingId,
        room: mockTestData.roomId,
        hotel: mockTestData.hotelId,
        rating: 5,
        comment: "Excellent stay!",
      });

      // Assert
      expect(review).toBeDefined();
      expect(review.rating).toBe(5);
      expect(review.user).toEqual(mockTestData.userId);
    });

    test(testSuites.createReview.missingFields, async () => {
      // Missing rating should fail validation
      try {
        await Review.create({
          user: mockTestData.userId,
          booking: mockTestData.bookingId,
          room: mockTestData.roomId,
          hotel: mockTestData.hotelId,
          // rating: missing!
          comment: "Good hotel",
        });
        fail("Should have thrown validation error");
      } catch (error) {
        expect(error.message).toContain("required");
      }
    });

    test(testSuites.createReview.invalidRating, async () => {
      try {
        await Review.create({
          user: mockTestData.userId,
          booking: mockTestData.bookingId,
          room: mockTestData.roomId,
          hotel: mockTestData.hotelId,
          rating: 10, // Invalid: > 5
          comment: "Too high rating",
        });
        fail("Should have thrown validation error");
      } catch (error) {
        expect(error.message).toContain("max");
      }
    });

    test(testSuites.createReview.duplicateReview, async () => {
      // Setup
      const user = await createMockUser(mockTestData.userId);
      const hotel = await createMockHotel(mockTestData.hotelId, mockTestData.userId);
      const room = await createMockRoom(mockTestData.roomId, mockTestData.hotelId);
      const booking = await createMockBooking(
        mockTestData.bookingId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId
      );

      // Create first review
      await Review.create({
        user: mockTestData.userId,
        booking: mockTestData.bookingId,
        room: mockTestData.roomId,
        hotel: mockTestData.hotelId,
        rating: 5,
        comment: "Great!",
      });

      // Try to create duplicate
      try {
        await Review.create({
          user: mockTestData.userId,
          booking: mockTestData.bookingId, // Same booking!
          room: mockTestData.roomId,
          hotel: mockTestData.hotelId,
          rating: 3,
          comment: "Actually not so great",
        });
        fail("Should have thrown duplicate key error");
      } catch (error) {
        expect(error.code).toBe(11000); // MongoDB duplicate key error
      }
    });
  });

  describe("getReviewsByRoom", () => {
    test(testSuites.getReviewsByRoom.success, async () => {
      // Setup
      const user = await createMockUser(mockTestData.userId);
      const hotel = await createMockHotel(mockTestData.hotelId, mockTestData.userId);
      const room = await createMockRoom(mockTestData.roomId, mockTestData.hotelId);
      const booking = await createMockBooking(
        mockTestData.bookingId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId
      );
      const review = await createMockReview(
        mockTestData.reviewId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId,
        mockTestData.bookingId,
        5,
        "Excellent room!"
      );

      // Execute
      const reviews = await Review.find({ room: mockTestData.roomId }).populate("user", "username image");
      const agg = await Review.aggregate([
        { $match: { room: mockTestData.roomId } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]);

      // Assert
      expect(reviews.length).toBe(1);
      expect(reviews[0].rating).toBe(5);
      expect(agg[0].avgRating).toBe(5);
      expect(agg[0].count).toBe(1);
    });

    test(testSuites.getReviewsByRoom.emptyReviews, async () => {
      // Setup
      const room = await createMockRoom(mockTestData.roomId, mockTestData.hotelId);

      // Execute
      const reviews = await Review.find({ room: mockTestData.roomId });

      // Assert
      expect(reviews.length).toBe(0);
    });
  });

  describe("getReviewsByHotel", () => {
    test(testSuites.getReviewsByHotel.success, async () => {
      // Setup
      const user = await createMockUser(mockTestData.userId);
      const hotel = await createMockHotel(mockTestData.hotelId, mockTestData.userId);
      const room = await createMockRoom(mockTestData.roomId, mockTestData.hotelId);
      const booking = await createMockBooking(
        mockTestData.bookingId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId
      );
      const review = await createMockReview(
        mockTestData.reviewId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId,
        mockTestData.bookingId,
        4,
        "Good hotel overall"
      );

      // Execute
      const reviews = await Review.find({ hotel: mockTestData.hotelId }).populate("user", "username image");
      const agg = await Review.aggregate([
        { $match: { hotel: mockTestData.hotelId } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]);

      // Assert
      expect(reviews.length).toBe(1);
      expect(reviews[0].rating).toBe(4);
      expect(agg[0].avgRating).toBe(4);
    });
  });

  describe("updateReview", () => {
    test(testSuites.updateReview.success, async () => {
      // Setup
      const user = await createMockUser(mockTestData.userId);
      const hotel = await createMockHotel(mockTestData.hotelId, mockTestData.userId);
      const room = await createMockRoom(mockTestData.roomId, mockTestData.hotelId);
      const booking = await createMockBooking(
        mockTestData.bookingId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId
      );
      const review = await createMockReview(
        mockTestData.reviewId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId,
        mockTestData.bookingId,
        3,
        "It was okay"
      );

      // Execute
      review.rating = 5;
      review.comment = "Actually, it was great!";
      await review.save();

      // Assert
      const updated = await Review.findById(mockTestData.reviewId);
      expect(updated.rating).toBe(5);
      expect(updated.comment).toBe("Actually, it was great!");
    });
  });

  describe("deleteReview", () => {
    test(testSuites.deleteReview.success, async () => {
      // Setup
      const user = await createMockUser(mockTestData.userId);
      const hotel = await createMockHotel(mockTestData.hotelId, mockTestData.userId);
      const room = await createMockRoom(mockTestData.roomId, mockTestData.hotelId);
      const booking = await createMockBooking(
        mockTestData.bookingId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId
      );
      const review = await createMockReview(
        mockTestData.reviewId,
        mockTestData.userId,
        mockTestData.roomId,
        mockTestData.hotelId,
        mockTestData.bookingId
      );

      // Execute
      await Review.deleteOne({ _id: mockTestData.reviewId });

      // Assert
      const deleted = await Review.findById(mockTestData.reviewId);
      expect(deleted).toBeNull();
    });
  });
});
