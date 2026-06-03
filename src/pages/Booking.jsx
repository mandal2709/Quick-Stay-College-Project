import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import API_BASE_URL from "../config/api";

const Booking = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "simple";
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  const selectedCategoryCapacity = Number(
    room?.categoryGuestLimits?.[category] ?? 1,
  );
  const guestsCount = Number(formData.guests) || 1;
  const isGuestCountValid = guestsCount > 0 && guestsCount <= selectedCategoryCapacity;

  const getCategoryOffer = (room, category) => {
    const originalPrice = Number(room?.categoryPrices?.[category] || 0);
    const discount = Number(room?.categoryDiscounts?.[category] || 0);
    const discountedPrice = Math.max(originalPrice - discount, 0);

    return {
      originalPrice,
      discount,
      discountedPrice,
    };
  };
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const getNextDay = (date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next.toISOString().split("T")[0];
  };

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

  useEffect(() => {
    const queryCheckIn = searchParams.get("checkIn");
    const queryCheckOut = searchParams.get("checkOut");
    const queryGuests = searchParams.get("guests");

    setFormData((prev) => ({
      ...prev,
      checkIn: queryCheckIn || prev.checkIn,
      checkOut: queryCheckOut || prev.checkOut,
      guests:
        queryGuests && Number.isFinite(Number(queryGuests))
          ? queryGuests
          : prev.guests,
    }));
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };

      if (
        name === "checkIn" &&
        updatedFormData.checkOut &&
        updatedFormData.checkOut < getNextDay(value)
      ) {
        updatedFormData.checkOut = "";
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut || !formData.guests) {
      alert("Please fill in all fields");
      return;
    }

    if (!isGuestCountValid) {
      alert(
        `Selected category allows up to ${selectedCategoryCapacity} guest${
          selectedCategoryCapacity !== 1 ? "s" : ""
        }. Please reduce the number of guests or choose a different category.`,
      );
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

    const categoryOffer = getCategoryOffer(room, category);
    const pricePerNight = categoryOffer.discountedPrice;
    const totalPrice = nights * pricePerNight * parseInt(formData.guests);

    try {
      setSubmitting(true);

      const bookingData = {
        room: id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests),
        totalPrice: totalPrice,
        roomCategory: category,
        pricePerNight: pricePerNight,
        categoryDiscount: categoryOffer.discount,
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
  const categoryOffer = getCategoryOffer(room, category);
  const pricePerNight = categoryOffer.discountedPrice;
  const totalPrice =
    nights > 0 ? nights * pricePerNight * parseInt(formData.guests) : 0;

  return (
    <div className="px-4 py-24 sm:px-6 md:px-12 lg:px-20 xl:px-32">
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
            <p className="text-gray-600 mb-4">
              <strong>Room Category:</strong>{" "}
              <span className="capitalize">{category}</span>
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Price per night:</strong>{" "}
              {categoryOffer.discount > 0 ? (
                <>
                  <span className="line-through text-gray-400 mr-2">
                    ₹{categoryOffer.originalPrice}
                  </span>
                  <span className="text-gray-900">₹{pricePerNight}</span>
                </>
              ) : (
                `₹${pricePerNight}`
              )}
            </p>
            {categoryOffer.discount > 0 && (
              <p className="text-sm text-red-600 mb-4">
                Save ₹{categoryOffer.discount} per night
              </p>
            )}

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
          <div className="rounded-xl bg-white p-6 shadow-lg lg:sticky lg:top-24">
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
                  min={today}
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
                  min={
                    formData.checkIn
                      ? getNextDay(formData.checkIn)
                      : getNextDay(today)
                  }
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
                    ₹{pricePerNight} x {nights} night{nights !== 1 ? "s" : ""} x{" "}
                    {formData.guests} guest
                    {parseInt(formData.guests) !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total Price:</span>
                  <span className="text-orange-500">₹{totalPrice}</span>
                </div>
              </div>

              {(!isGuestCountValid || guestsCount <= 0) && (
                <p className="text-sm text-red-600">
                  The selected category supports up to {selectedCategoryCapacity} guest{selectedCategoryCapacity !== 1 ? "s" : ""}.
                </p>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !isGuestCountValid}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white rounded-md px-6 py-3 cursor-pointer font-medium text-base mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating Booking..." : "Confirm Booking"}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/rooms/${id}?checkIn=${encodeURIComponent(formData.checkIn)}&checkOut=${encodeURIComponent(formData.checkOut)}&guests=${encodeURIComponent(formData.guests)}`,
                  )
                }
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
