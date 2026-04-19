import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index }) => {
  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => scrollTo(0, 0)}
      className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white text-gray-600 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(15,23,42,0.12)]"
    >
      <img
        src={room.images[0]}
        alt={room.title}
        className="h-56 w-full object-cover"
      />

      {index % 2 === 0 && (
        <p className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-800">
          Best Seller
        </p>
      )}

      <div className="p-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-playfair text-xl font-medium text-gray-800">
            {room.title}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-1 text-sm">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.location}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm">
            <span className="text-xl text-gray-800">${room.price}</span> /night
          </p>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
