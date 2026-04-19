import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
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

const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedSortOption, setSelectedSortOption] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rooms`);
        const data = await response.json();
        const approvedRooms = data.filter(
          (room) => room.approvalStatus === "approved",
        );
        setRooms(approvedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const roomTypeOptions = [
    { label: "Single Bed", value: "single" },
    { label: "Double Bed", value: "double" },
    { label: "Luxury Room", value: "luxury" },
    { label: "Family Suite", value: "suite" },
  ];

  const handleTypeChange = (checked, label) => {
    const option = roomTypeOptions.find((item) => item.label === label);
    const value = option ? option.value : label.toLowerCase();

    setSelectedRoomTypes((prev) => {
      if (checked) return [...prev, value];
      return prev.filter((item) => item !== value);
    });
  };

  const handlePriceChange = (checked, label) => {
    if (checked) {
      setSelectedPriceRange(label.replace("$ ", ""));
    } else {
      setSelectedPriceRange("");
    }
  };

  const clearAllFilters = () => {
    setSelectedRoomTypes([]);
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

    if (selectedRoomTypes.length) {
      filtered = filtered.filter((room) =>
        selectedRoomTypes.includes(String(room.roomType || "").toLowerCase()),
      );
    }

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
            Hotel Rooms
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-500/90 md:text-base">
            Take advantage of our limited-time offer and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        {roomsToRender.map((room) => (
          <div
            key={room._id}
            className="flex flex-col items-start gap-6 border-b border-gray-200 py-8 last:border-0 md:flex-row"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt={room.title}
              title="View room details"
              className="h-64 w-full cursor-pointer rounded-2xl object-cover shadow-lg md:h-72 md:w-[42%]"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="text-gray-500">{room.location}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer font-playfair text-2xl text-gray-800 sm:text-3xl"
              >
                {room.title}
              </p>
              <div className="flex items-center">
                <StarRating />
                <p className="ml-2">200+ review</p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <img src={assets.locationIcon} alt="location icon" />
                <span>{room.location}</span>
              </div>

              <div className="mb-4 mt-3 flex flex-wrap items-center gap-3">
                {Object.keys(room.amenities || {})
                  .filter((item) => room.amenities[item])
                  .map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-lg bg-[#F5F5FF]/70 px-3 py-2"
                    >
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
              </div>

              <p className="text-xl font-medium text-gray-700">
                ${room.price}/night
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky top-20 z-20 mb-3 w-full self-start border border-gray-300 bg-white text-gray-600 shadow-sm lg:mt-16 lg:w-80">
        <div
          className={`flex items-center justify-between border-gray-300 px-5 py-3 ${
            openFilters ? "border-b" : ""
          } lg:border-b`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="flex gap-3 text-xs">
            <span
              onClick={() => setOpenFilters((prev) => !prev)}
              className="cursor-pointer lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span
              className="hidden cursor-pointer text-blue-600 hover:text-blue-700 lg:block"
              onClick={clearAllFilters}
            >
              CLEAR
            </span>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            openFilters ? "max-h-[640px]" : "max-h-0 lg:max-h-[640px]"
          }`}
        >
          <div className="px-5 pb-5 pt-5">
            <p className="pb-2 font-medium text-gray-800">Popular Filters</p>
            {roomTypeOptions.map((type) => (
              <CheckBox
                key={type.value}
                label={type.label}
                selected={selectedRoomTypes.includes(type.value)}
                onChange={handleTypeChange}
              />
            ))}

            <div className="pt-5">
              <p className="pb-2 font-medium text-gray-800">Price Range</p>
              {priceRange.map((range) => (
                <CheckBox
                  key={range}
                  label={`$ ${range}`}
                  selected={selectedPriceRange === range}
                  onChange={handlePriceChange}
                />
              ))}
            </div>

            <div className="pt-5">
              <p className="pb-2 font-medium text-gray-800">Sort By</p>
              {sortOptions.map((option) => (
                <RadioButton
                  key={option}
                  label={option}
                  selected={selectedSortOption === option}
                  onChange={setSelectedSortOption}
                />
              ))}
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 lg:hidden"
              onClick={clearAllFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
