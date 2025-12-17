import { useState, useEffect, useCallback } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const AllHotels = () => {
  const { navigate, axios } = useAppContext();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all hotels
  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/hotels");
      if (data.success) {
        setHotels(data.hotels || []);
      } else {
        toast.error(data.message || "Failed to fetch hotels");
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch hotels"
      );
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Handle hotel selection - navigate to AllRooms page
  const handleHotelClick = (hotel) => {
    navigate(`/rooms/hotel/${hotel._id}`);
  };

  // Fetch hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 md:pt-35 px-3 sm:px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="w-full">
        {/* Main Title */}
        <div className="flex flex-col items-start text-left mb-6 sm:mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-[40px]">
            Hotels
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Discover amazing hotels and accommodations around the world. Select a hotel to view available rooms.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => handleHotelClick(hotel)}
                className="flex flex-col items-start py-6 sm:py-8 gap-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all p-6"
              >
                <div className="w-full flex flex-col gap-2">
                  <h2 className="text-gray-800 text-2xl sm:text-3xl font-playfair">
                    {hotel.name}
                  </h2>
                  <div className="flex items-center gap-1 text-gray-500 mt-2 text-xs sm:text-sm">
                    <img
                      src={assets.locationIcon}
                      alt="location-icon"
                      className="flex-shrink-0"
                    />
                    <span>
                      {hotel.address}, {hotel.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 mt-1 text-xs sm:text-sm">
                    <span>Contact: {hotel.contact}</span>
                  </div>
                  <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    View Rooms →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">No hotels available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllHotels;

