import React from "react";
import { assets } from "../assets/assets";
import heroImage2 from "../assets/heroImage2.jpg";
import { useState } from "react";
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
      const response = await fetch(
        `${API_BASE_URL}/api/availability/check-availability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkAvailabilityData),
        },
      );
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("An error occurred while checking availability. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-start justify-center px-6
     md:px-16 lg:px-24 xl:px-32 text-white
      bg-no-repeat bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${heroImage2})` }}
    >
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20 text-black">
        {" "}
        The ultimate Hotel Experience{" "}
      </p>

      <h1
        className="font -playfair text-2x1 md:text-5x1 md:text-[56px]md:leadind-
        [56px]font-bold md:font-extrabold max -w-x1 mt-4 text-black"
      >
        Discover Your Perfect Gateway Destination
      </h1>

      <p className="max -w-130 mt-2 text-sm md :text-base text-black">
        {" "}
        Luxury and Comfort a wait at the world's most exclusive Hotel and
        resort.Start your journy today.{" "}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row
                  max-md:items-start gap-4 max-md:mx-auto"
      >
        <div>
          <div className="flex items-center gap-2 text-black">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="location">Destination</label>
          </div>
          <div>{formData.location}</div>
          <input
            id="location"
            name="location"
            type="text"
            onChange={handleInputChange}
            className=" rounded border border-black-200 px-3 py-1.5 mt-1.5 text-sm outline-none "
            placeholder="Location"
            required
          />
        </div>

        <div>
          <div className="flex items-center gap-2 text-black">
            <img src={assets.calenderIcon} alt="" className="h-4 " />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <div>{formData.checkIn}</div>
          <input
            id="checkIn"
            name="checkIn"
            onChange={handleInputChange}
            type="date"
            className=" rounded border 
                border-black-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 text-black">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <div>{formData.checkOut}</div>
          <input
            id="checkOut"
            name="checkOut"
            onChange={handleInputChange}
            type="date"
            className=" rounded border border-black-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          />
        </div>

        {/* <div className='flex md:flex-col max-md:gap-2 max-md:items-center text-black'>
                    <label htmlFor="guests">Guests</label>
                    <input min={1} max={4} id="guests" type="number" className=" rounded border border-black-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
                </div> */}

        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1"
        >
          <img src={assets.searchIcon} alt="searchicon" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
