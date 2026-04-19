import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import API_BASE_URL from "../config/api";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rooms/${id}`);
        const data = await response.json();
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room details:", error);
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut || !formData.guests) {
      alert("Please fill in all fields");
      return;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    if (checkOutDate <= checkInDate) {
      alert("Check-out date must be after check-in date");
      return;
    }

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = nights * room.price * parseInt(formData.guests);

    try {
      setSubmitting(true);

      const bookingData = {
        room: id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests),
        totalPrice: totalPrice,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/bookings/create-booking/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send cookies for authentication
          body: JSON.stringify(bookingData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Booking created successfully!");
        navigate("/my-booking");
      } else {
        alert(data.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating the booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Room not found</p>
      </div>
    );
  }

  const checkInDate = new Date(formData.checkIn);
  const checkOutDate = new Date(formData.checkOut);
  const nights =
    formData.checkIn && formData.checkOut
      ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice =
    nights > 0 ? nights * room.price * parseInt(formData.guests) : 0;

  return (
    <div className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      <h1 className="text-3xl sm:text-4xl font-playfair font-bold mb-8">
        Booking Details
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Room Summary */}
        <div className="flex-1">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-playfair font-bold mb-4">
              {room.title}
            </h2>

            {room.images && room.images[0] && (
              <img
                src={room.images[0]}
                alt={room.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <p className="text-gray-600 mb-2">
              <strong>Location:</strong> {room.location}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Room Type:</strong> {room.roomType}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Price per night:</strong> ${room.price}
            </p>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Amenities:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(room.amenities)
                  .filter((item) => room.amenities[item])
                  .map((item, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="flex-1">
          <div className="bg-white shadow-lg rounded-xl p-6 sticky top-20">
            <h2 className="text-2xl font-playfair font-bold mb-6">
              Complete Your Booking
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Check-In */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Check-In Date
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Check-Out */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  defaultValue="1"
                  name="guests"
                  placeholder="eg. 1"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                  min="1"
                  required
                />
              </div>

              {/* Pricing Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    ${room.price} x {nights} night{nights !== 1 ? "s" : ""} x{" "}
                    {formData.guests} guest
                    {parseInt(formData.guests) !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">${totalPrice}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total Price:</span>
                  <span className="text-orange-500">${totalPrice}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded-md px-6 py-3 cursor-pointer font-medium text-base mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating Booking..." : "Confirm Booking"}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => navigate(`/rooms/${id}`)}
                className="w-full bg-gray-300 hover:bg-gray-400 transition-all text-gray-800 rounded-md px-6 py-2 cursor-pointer font-medium text-base"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
