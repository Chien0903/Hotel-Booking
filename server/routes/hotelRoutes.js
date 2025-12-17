import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerHotel,
  getUserHotels,
  getHotelById,
  getAllHotels,
} from "../controllers/hotelController.js";

const hotelRouter = express.Router();

// Test route to verify router is working
hotelRouter.get("/test", (req, res) => {
  res.json({ success: true, message: "Hotel router is working" });
});

hotelRouter.post("/", protect, registerHotel);
// Important: Put specific routes before dynamic routes
hotelRouter.get("/", getAllHotels); // Get all hotels (public)
hotelRouter.get("/owner", protect, getUserHotels); // Get user's hotels (protected)
hotelRouter.get("/:hotelId", getHotelById);

export default hotelRouter;
