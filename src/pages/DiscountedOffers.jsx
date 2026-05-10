import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import HotelCard from "../components/HotelCard";
import API_BASE_URL from "../config/api";

const DiscountedOffers = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscountedRooms = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE_URL}/api/rooms/discounted`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load discounted rooms");
          setRooms([]);
          return;
        }

        setRooms(data);
      } catch (err) {
        console.error("Error fetching discounted rooms:", err);
        setError(err.message || "Failed to load discounted rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedRooms();
  }, []);

  return (
    <div className="px-4 py-20 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Title
          align="left"
          title="All Discounted Offers"
          subTitle="Explore every room currently offering a discount and book the best deal."
        />
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      {loading ? (
        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 px-6 py-8 text-blue-700">
          Loading discounted offers...
        </div>
      ) : error ? (
        <div className="mt-12 rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-red-700">
          {error}
        </div>
      ) : rooms.length === 0 ? (
        <div className="mt-12 rounded-lg border border-yellow-200 bg-yellow-50 px-6 py-8 text-yellow-700">
          No discounted rooms are available right now.
        </div>
      ) : (
        <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <HotelCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountedOffers;
