import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import StarRating from "../components/StarRating";
import API_BASE_URL from "../config/api";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="mt-2 flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="select-none font-light">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="mt-2 flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="select-none font-light">{label}</span>
    </label>
  );
};

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const [openFilters, setOpenFilters] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        setLoading(true);
        // Fetch availability data
        const availabilityResponse = await fetch(
          `${API_BASE_URL}/api/availability/check-availability`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              location,
              checkIn,
              checkOut,
            }),
          },
        );

        const availabilityData = await availabilityResponse.json();
        console.log("Availability API Response:", availabilityData);

        // Handle different response structures
        let availableRoomIds = [];

        if (Array.isArray(availabilityData)) {
          // If response is an array
          availableRoomIds = availabilityData.map(
            (item) => item.roomId || item._id,
          );
        } else if (availabilityData && typeof availabilityData === "object") {
          // If response is an object with available rooms
          if (
            availabilityData.available &&
            Array.isArray(availabilityData.available)
          ) {
            availableRoomIds = availabilityData.available.map(
              (item) => item.roomId || item._id,
            );
          } else if (
            availabilityData.availableRooms &&
            Array.isArray(availabilityData.availableRooms)
          ) {
            availableRoomIds = availabilityData.availableRooms.map(
              (item) => item.roomId || item._id,
            );
          } else if (
            availabilityData.rooms &&
            Array.isArray(availabilityData.rooms)
          ) {
            availableRoomIds = availabilityData.rooms.map(
              (item) => item.roomId || item._id,
            );
          }
        }

        // Fetch all rooms
        const roomsResponse = await fetch(`${API_BASE_URL}/api/rooms`);
        const allRooms = await roomsResponse.json();

        // Filter rooms by location, availability, and approval status
        const filtered = allRooms.filter(
          (room) =>
            availableRoomIds.includes(room._id) &&
            room.approvalStatus === "approved" &&
            room.location?.toLowerCase() === location?.toLowerCase(),
        );

        setRooms(filtered);
        setAvailableRooms(filtered);
      } catch (error) {
        console.error("Error fetching available rooms:", error);
        setRooms([]);
        setAvailableRooms([]);
      } finally {
        setLoading(false);
      }
    };

    if (location && checkIn && checkOut) {
      fetchAvailableRooms();
    }
  }, [location, checkIn, checkOut]);

  const handlePriceChange = (checked, label) => {
    if (checked) {
      setSelectedPriceRange(label.replace("$ ", ""));
    } else {
      setSelectedPriceRange("");
    }
  };

  const clearAllFilters = () => {
    setSelectedPriceRange("");
    setSelectedSortOption("");
  };

  const priceRange = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  const roomsToRender = (() => {
    let filtered = [...rooms];

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange
        .split(" to ")
        .map((value) => Number(value.trim()));

      filtered = filtered.filter((room) => {
        const price = Number(room.price);
        return price >= min && price <= max;
      });
    }

    if (selectedSortOption.trim()) {
      if (selectedSortOption === "Price Low to High") {
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectedSortOption === "Price High to Low") {
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectedSortOption === "Newest First") {
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || b.updatedAt || 0) -
            new Date(a.createdAt || a.updatedAt || 0),
        );
      }
    }

    return filtered;
  })();

  return (
    <div className="flex flex-col-reverse gap-8 px-4 pb-12 pt-24 sm:px-6 md:px-12 lg:flex-row lg:items-start lg:px-20 xl:px-32">
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-[40px]">
            Available Rooms
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-500/90 md:text-base">
            {location && (
              <>
                In <span className="font-semibold text-black">{location}</span>
                {" • "}
              </>
            )}
            Check-in:{" "}
            <span className="font-semibold text-black">{checkIn}</span>
            {" • "}
            Check-out:{" "}
            <span className="font-semibold text-black">{checkOut}</span>
          </p>
        </div>

        {loading ? (
          <div className="mt-8 text-center text-gray-500">
            <p>Loading available rooms...</p>
          </div>
        ) : roomsToRender.length === 0 ? (
          <div className="mt-8 text-center text-gray-500">
            <p>No rooms available for your search criteria.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 inline-block rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              Try Different Dates
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roomsToRender.map((room) => (
              <div
                key={room._id}
                className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 shadow-md transition hover:shadow-lg"
                onClick={() =>
                  navigate(
                    `/rooms/${room._id}?checkIn=${checkIn}&checkOut=${checkOut}`,
                  )
                }
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-300">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {room.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{room.location}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {room.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-blue-600">
                        ${room.categoryPrices?.simple ?? room.price}
                        <span className="text-sm text-gray-600">/night</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={room.rating || 0} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="min-w-72 rounded-lg bg-white p-6 shadow-md lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Filters</h3>
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-500 hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-gray-700">Room Type</h4>
          <p className="text-sm text-gray-500">
            Room type filtering has been removed. Use price and sort filters for
            results.
          </p>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-700">Price Range</h4>
          {priceRange.map((range) => (
            <CheckBox
              key={range}
              label={`$ ${range}`}
              selected={selectedPriceRange === range}
              onChange={handlePriceChange}
            />
          ))}
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-700">Sort By</h4>
          {sortOptions.map((option) => (
            <RadioButton
              key={option}
              label={option}
              selected={selectedSortOption === option}
              onChange={setSelectedSortOption}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
