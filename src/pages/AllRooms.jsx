import React, { useEffect, useState } from "react";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import API_BASE_URL from "../config/api";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className=" flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className=" flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
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
        console.log("Fetched rooms:", approvedRooms);
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
  useEffect(() => {
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
            new Date(b.createdAt || b.updatedAt || Date.now()) -
            new Date(a.createdAt || a.updatedAt || Date.now()),
        );
      }
    }

    setFilteredRooms(filtered);
  }, [rooms, selectedRoomTypes, selectedPriceRange, selectedSortOption]);

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

  const handleSortChange = (label) => {
    setSelectedSortOption(label);
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

  return (
    <div
      className="flex flex-col-reverse lg:flex-row item-start justify-between pt-28 md:pt-35 px-4
    md:px-16 lg:px-24 xl:px-32"
    >
      <div>
        <div className="flex flex-col item-start text-left">
          <h1 className="font-playfair text-4x1 md:text-[40px]">Hotel Rooms</h1>
          <p
            className="text-sm md:text-base text-gray-500/90 mt-2
          max-w-174"
          >
            Take advantage of our limited-time offer and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        {(filteredRooms.length ? filteredRooms : rooms).map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gry-300
            last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              title="ViewRoom Details"
              className="max-h-65 md:w-1/2 rounded-x1 shadow-lg object-cover cursor-pointer"
            />

            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.location}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3x1 font-playfair cursor-pointer"
              >
                {room.title}
              </p>
              <div className="flex item-center">
                <StarRating />
                <p className="ml-2">200+ review</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt=" location-icon" />
                <span>{room.location}</span>
              </div>
              {/* Room Amenities*/}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {Object.keys(room.amenities)
                  .filter((item) => room.amenities[item]) // ✅ only true values
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      {/* <img
                        src={facilityIcons[item]}
                        alt={item}
                        className="w-5 h-5"
                      /> */}
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
              </div>
              {/* Room Price Per Night*/}
              <p className="text-xl font-medium text-gray-700">
                ${room.price}/night
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Filter */}
      <div className="mb-3 bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16 sticky top-24 self-start z-20">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b
        border-gray-300 ${openFilters && "border-b"}`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer flex gap-3">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span
              className="hidden lg:block text-blue-600 hover:text-blue-700"
              onClick={clearAllFilters}
            >
              CLEAR
            </span>
          </div>
        </div>

        <div
          className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden
          transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
            {roomTypeOptions.map((type) => (
              <CheckBox
                key={type.value}
                label={type.label}
                selected={selectedRoomTypes.includes(type.value)}
                onChange={handleTypeChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRange.map((range) => (
              <CheckBox
                key={range}
                label={`$ ${range}`}
                selected={selectedPriceRange === range}
                onChange={handlePriceChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option) => (
              <RadioButton
                key={option}
                label={option}
                selected={selectedSortOption === option}
                onChange={handleSortChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
