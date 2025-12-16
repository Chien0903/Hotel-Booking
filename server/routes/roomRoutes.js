import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createRoom, getRooms, toggleRoomAvailability, getOwnerRooms, getRoomsByHotel } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 5), protect, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, getOwnerRooms);
roomRouter.get("/hotel/:hotelId", getRoomsByHotel);
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);

export default roomRouter;
