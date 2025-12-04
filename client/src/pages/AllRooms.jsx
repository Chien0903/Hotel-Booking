import { useState, useMemo } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import StarRating from '../components/StarRating'
import { useSearchParams } from 'react-router-dom'

const CheckBox = ({ label, selected = true, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton = ({ label, selected = true, onChange = () => { } }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input type="radio" name="sortOption" checked={selected} onChange={() => onChange(label)} />
            <span className="font-light select-none">{label}</span>
        </label>
    );
}

const AllRooms = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const { facilityIcons, navigate, rooms, currency } = useAppContext();
    const [openFilters, setOpenFilters] = useState(false);

    // State for managing the selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        roomType: [],
        priceRange: [],
    });
    const [selectedSort, setSelectedSort] = useState('');

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite",
    ];

    const priceRanges = [
        '0 to 500',
        '500 to 1000',
        '1000 to 2000',
        '2000 to 3000',
    ];

    const sortOptions = [
        "Price Low to High",
        "Price High to Low",
        "Newest First"
    ];


    // Handle changes for filters and sorting
    const handleFilterChange = (checked, value, type) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (checked) {
                updatedFilters[type].push(value);
            } else {
                updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
            }
            return updatedFilters;
        });
    }

    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption);
    }

    // Function to check if a room matches the selected room types
    const matchesRoomType = (room) => {
        return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType);
    };

    // Function to check if a room matches the selected price ranges
    const matchesPriceRange = (room) => {
        return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some(range => {
            const [min, max] = range.split(' to ').map(Number);
            return room.pricePerNight >= min && room.pricePerNight <= max;
        });
    };

    // Function to sort rooms based on the selected sort option
    const sortRooms = (a, b) => {
        if (selectedSort === 'Price Low to High') {
            return a.pricePerNight - b.pricePerNight;
        }
        if (selectedSort === 'Price High to Low') {
            return b.pricePerNight - a.pricePerNight;
        }
        if (selectedSort === 'Newest First') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    };

    // Filter Destination
    const filterDestination = (room) => {
        const destination = searchParams.get('destination');
        if (!destination) return true;
        return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
    }

    // Filter and sort rooms based on the selected filters and sort option
    const filteredRooms = useMemo(() => {
        return rooms
            .filter(room => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room))
            .sort(sortRooms);
    }, [rooms, selectedFilters, selectedSort, searchParams]);

    // Clear all filters
    const clearFilters = () => {
        setSelectedFilters({
            roomType: [],
            priceRange: [],
        });
        setSelectedSort('')
        setSearchParams({});
    }

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-20 sm:pt-24 md:pt-28 md:pt-35 px-3 sm:px-4 md:px-16 lg:px-24 xl:px-32 gap-6 lg:gap-8'>
            <div className='w-full lg:flex-1'>
                {/* Main Title */}
                <div className="flex flex-col items-start text-left mb-6 sm:mb-8">
                    <h1 className='font-playfair text-3xl sm:text-4xl md:text-[40px]'>Hotel Rooms</h1>
                    <p className='text-xs sm:text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
                </div>

                {filteredRooms.map((room) => (
                    <div key={room._id} className='flex flex-col sm:flex-row items-start py-6 sm:py-8 md:py-10 gap-3 sm:gap-4 md:gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                        {/* Room Image */}
                        <img title='View Room Details' onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }} src={room.images[0]} alt="hotel-img" className='w-full sm:w-48 md:w-1/2 h-32 sm:h-40 md:h-auto md:max-h-65 rounded-xl shadow-lg object-cover cursor-pointer flex-shrink-0' />
                        <div className='w-full sm:flex-1 flex flex-col gap-2'>
                            <p className='text-xs sm:text-sm text-gray-500'>{room.hotel.city}</p>
                            <p onClick={() => { navigate(`/rooms/${room._id}`); scrollTo(0, 0) }} className='text-gray-800 text-2xl sm:text-3xl font-playfair cursor-pointer' title='View Room Details'>{room.hotel.name}</p>
                            <div className='flex items-center gap-2'>
                                <StarRating />
                                <p className='text-xs sm:text-sm'>200+ reviews</p>
                            </div>
                            <div className='flex items-center gap-1 text-gray-500 mt-1 text-xs sm:text-sm truncate'>
                                <img src={assets.locationIcon} alt="location-icon" className='flex-shrink-0' />
                                <span className='truncate'>{room.hotel.address}</span>
                            </div>
                            {/* Room Amenities */}
                            <div className='flex flex-wrap items-center mt-2 mb-3 gap-2 sm:gap-3'>
                                {room.amenities.slice(0, 3).map((item, index) => (
                                    <div key={index} className='flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-4 h-4 flex-shrink-0' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                                {room.amenities.length > 3 && (
                                    <p className='text-xs text-gray-500'>+{room.amenities.length - 3} more</p>
                                )}
                            </div>
                            {/* Room Price per Night */}
                            <p className='text-lg sm:text-xl font-medium text-gray-700'>${room.pricePerNight} /night</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white w-full sm:w-80 border border-gray-300 text-gray-600 lg:min-w-[320px]">
                <div className={`flex items-center justify-between px-3 sm:px-5 py-2.5 lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
                    <p className='text-sm sm:text-base font-medium text-gray-800'>FILTERS</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden'>
                            {openFilters ? "HIDE" : "SHOW"}
                        </span>
                        <span onClick={clearFilters} className='hidden lg:block'>CLEAR</span>
                    </div>
                </div>
                <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                    <div className='px-3 sm:px-5 pt-3 sm:pt-5'>
                        <p className='font-medium text-gray-800 pb-2 text-sm sm:text-base'>Popular filters</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox key={index} label={room} selected={selectedFilters.roomType.includes(room)} onChange={(checked) => handleFilterChange(checked, room, 'roomType')} />
                        ))}
                    </div>
                    <div className='px-3 sm:px-5 pt-3 sm:pt-5'>
                        <p className='font-medium text-gray-800 pb-2 text-sm sm:text-base'>Price Range</p>
                        {priceRanges.map((range, index) => (
                            <CheckBox key={index} label={`${currency} ${range}`} selected={selectedFilters.priceRange.includes(range)} onChange={(checked) => handleFilterChange(checked, range, 'priceRange')} />
                        ))}</div>
                    <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-5 sm:pb-7">
                        <p className="font-medium text-gray-800 pb-2 text-sm sm:text-base">Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton key={index} label={option} selected={selectedSort === option} onChange={() => handleSortChange(option)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllRooms;