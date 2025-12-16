import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// API to create a new hotel
// POST /api/hotels
export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = (req.user && req.user._id) || (req.auth && req.auth.userId);

    if (!owner) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    // Check if User Already Registered
    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({ success: false, message: "Hotel Already Registered" });
    }

    await Hotel.create({ name, address, contact, city, owner });

    // Update User Role
    if (req.user) {
      await User.findByIdAndUpdate(owner, { role: "hotelOwner" });
    }

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get hotels owned by the authenticated user
// GET /api/hotels/owner
export const getUserHotels = async (req, res) => {
  try {
    console.log("getUserHotels called");
    console.log("req.auth:", req.auth);
    const owner = req.auth?.userId;

    if (!owner) {
      console.log("No owner found in req.auth");
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    console.log("Finding hotels for owner:", owner);
    const hotels = await Hotel.find({ owner }).sort({ createdAt: -1 });
    console.log("Found hotels:", hotels.length);
    res.json({ success: true, hotels: hotels || [] });
  } catch (error) {
    console.error("Error in getUserHotels:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get a hotel by ID
// GET /api/hotels/:hotelId
export const getHotelById = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    res.json({ success: true, hotel });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
