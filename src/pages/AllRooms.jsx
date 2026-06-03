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
        const price = Number(room.categoryPrices?.simple || 0);
        return price >= min && price <= max;
      });
    }

    if (selectedSortOption.trim()) {
      if (selectedSortOption === "Price Low to High") {
        filtered.sort(
          (a, b) =>
            Number(a.categoryPrices?.simple || 0) -
            Number(b.categoryPrices?.simple || 0),
        );
      } else if (selectedSortOption === "Price High to Low") {
        filtered.sort(
          (a, b) =>
            Number(b.categoryPrices?.simple || 0) -
            Number(a.categoryPrices?.simple || 0),
        );
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

  const getBestOffer = (room) => {
    const categoryDiscounts = room.categoryDiscounts || {};
    const categoryPrices = room.categoryPrices || {};

    const offers = ["simple", "luxury", "premium"]
      .map((key) => {
        const originalPrice = categoryPrices[key] ?? room.price ?? 0;
        return {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          originalPrice,
          discount: categoryDiscounts[key] || 0,
        };
      })
      .filter((offer) => offer.originalPrice > 0);

    return offers.reduce(
      (best, current) => {
        const bestValue = best.originalPrice - best.discount;
        const currentValue = current.originalPrice - current.discount;
        return currentValue < bestValue ? current : best;
      },
      offers[0] || {
        label: "Offer",
        originalPrice: room.price || 0,
        discount: 0,
      },
    );
  };

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
                <StarRating rating={5} />
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

              <div>
                {room.categoryPrices && (
                  <div className="text-md text-gray-700 mt-1 space-y-0.5">
                    <p>Simple ₹{room.categoryPrices.simple}</p>
                    <p>Luxury ₹{room.categoryPrices.luxury}</p>
                    <p>Premium ₹{room.categoryPrices.premium}</p>
                  </div>
                )}
                {(() => {
                  const bestOffer = getBestOffer(room);
                  const discountedPrice =
                    bestOffer.originalPrice - bestOffer.discount;
                  return (
                    <div className="mt-3">
                      <p className="text-xl font-medium text-gray-700">
                        {bestOffer.discount > 0 ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">
                              ₹{bestOffer.originalPrice}
                            </span>
                            ₹{discountedPrice}
                          </>
                        ) : (
                          `₹${bestOffer.originalPrice}`
                        )}
                        <span className="text-sm text-gray-600">/night</span>
                      </p>
                      {bestOffer.discount > 0 && (
                        <p className="text-sm text-red-600 mt-1">
                          Save ₹{bestOffer.discount} ({bestOffer.label})
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
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
            <p className="text-sm text-gray-500">
              Room type filtering is no longer available. Use price and sort
              filters instead.
            </p>

            <div className="pt-5">
              <p className="pb-2 font-medium text-gray-800">Price Range</p>
              {priceRange.map((range) => (
                <CheckBox
                  key={range}
                  label={`₹ ${range}`}
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
