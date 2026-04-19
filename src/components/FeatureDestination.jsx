import React from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import API_BASE_URL from "../config/api";

const FeatureDestination = () => {
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rooms`);
        const data = await response.json();
        setRooms(data);
        console.log("Fetched rooms:", data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col items-center bg-slate-50 px-4 py-16 sm:px-6 md:px-12 lg:px-20">
      <Title
        title="Featured Destination "
        subTitle="Discover our handpicked selection of exception 
      properties around the world, offering unparalleled luxury and unforgettable experiences."
      />

      <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-6">
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="my-12 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50"
      >
        View All Destination
      </button>
    </div>
  );
};

export default FeatureDestination;
