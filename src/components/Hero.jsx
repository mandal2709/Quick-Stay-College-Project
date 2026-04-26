import React, { useState } from "react";
import { assets } from "../assets/assets";
import heroImage2 from "../assets/heroImage2.jpg";
import API_BASE_URL from "../config/api";

const Hero = () => {
  const [formData, setFormData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.checkIn || !formData.checkOut || !formData.location) {
      alert("Please fill in all fields");
      return;
    }

    const checkAvailabilityData = {
      location: formData.location,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
    };

    try {
      await fetch(`${API_BASE_URL}/api/availability/check-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkAvailabilityData),
      });
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("An error occurred while checking availability. Please try again.");
    }
  };

  const getNextDay = (date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next.toISOString().split("T")[0];
  };

  return (
    <div
      className="flex min-h-screen flex-col items-start justify-center bg-cover bg-center bg-no-repeat px-4 pb-12 pt-28 text-white sm:px-6 md:px-12 lg:px-20 xl:px-32"
      style={{ backgroundImage: `url(${heroImage2})` }}
    >
      <div className="max-w-3xl rounded-3xl bg-white/65 p-5 shadow-xl backdrop-blur-sm sm:p-8">
        <p className="inline-flex rounded-full bg-[#49B9FF]/60 px-3.5 py-1 text-sm text-black">
          The ultimate hotel experience
        </p>

        <h1 className="mt-4 max-w-2xl font-playfair text-4xl font-bold leading-tight text-black sm:text-5xl md:text-6xl">
          Discover your perfect getaway destination
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-black/80 sm:text-base">
          Luxury and comfort await at world-class hotels and resorts. Find the
          stay that fits your trip, dates, and budget in a few taps.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 rounded-2xl bg-white p-4 text-gray-500 shadow-lg sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-black">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              <label htmlFor="location">Destination</label>
            </div>
            <input
              id="location"
              name="location"
              type="text"
              onChange={handleInputChange}
              value={formData.location}
              className="mt-1.5 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
              placeholder="Location"
              required
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-black">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              <label htmlFor="checkIn">Check in</label>
            </div>
            <input
              id="checkIn"
              name="checkIn"
              min={new Date().toISOString().split("T")[0]}
              onChange={handleInputChange}
              value={formData.checkIn}
              type="date"
              className="mt-1.5 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-black">
              <img src={assets.calenderIcon} alt="" className="h-4" />
              <label htmlFor="checkOut">Check out</label>
            </div>
            <input
              id="checkOut"
              name="checkOut"
              min={
                formData.checkIn
                  ? getNextDay(formData.checkIn)
                  : getNextDay(new Date())
              }
              onChange={handleInputChange}
              value={formData.checkOut}
              type="date"
              className="mt-1.5 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-900 sm:col-span-2 lg:col-span-1"
          >
            <img src={assets.searchIcon} alt="searchicon" className="h-5 w-5" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
