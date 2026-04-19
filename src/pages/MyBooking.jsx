import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings/user-bookings",
          {
            credentials: "include",
          },
        );
        const data = await response.json();

        if (response.ok) {
          setBookings(data.bookings);
        } else {
          console.error("Failed to fetch bookings:", data.message);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking? This action cannot be undone.",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancelling(bookingId);
      const response = await fetch(
        `http://localhost:5000/api/bookings/cancel-booking/${bookingId}`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Update the booking status in state
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking,
          ),
        );
        alert("Booking cancelled successfully!");
      } else {
        alert(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("An error occurred while cancelling the booking");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Booking"
        subTitle="Easily manage past, current, and upcoming hotel reservation
      in one place.Plan your trips seamlessly with just afew click "
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div
          className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300
        font-medium text-base py-3"
        >
          <div className="w-1/2">Hotels</div>
          <div className="w-1/2">Date & Timing</div>
          <div className="w-1/2">Payment</div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">
              Start by booking your first room!
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b 
                border-gray-300 py-6 first:border-t"
            >
              {/* Hotel Details */}
              <div className="flex flex-col md:flex-row">
                <img
                  src={booking.room.images[0]}
                  alt="hotel-img"
                  className="min-md:w-44 rounded shadow object-cover"
                />

                <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                  <p className="font-playfair text-2xl">
                    {booking.room.title}
                    <span className="font-inter text-sm">
                      {" "}
                      ({booking.room.roomType})
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{booking.room.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <img src={assets.guestsIcon} alt="guests-icon" />
                    <span>Guests: {booking.guests}</span>
                  </div>
                  <p className="text-base">Total: ${booking.totalPrice}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                <div>
                  <p>Check-In:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkIn).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkOut).toDateString()}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex flex-col gap-2 mt-3 md:mt-0">
                <p
                  className={`font-medium ${
                    booking.status === "cancelled"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {booking.status === "cancelled" ? "Cancelled" : "Confirmed"}
                </p>
                <p className="text-gray-500 text-sm">
                  Booked on {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                {booking.status === "booked" && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={cancelling === booking._id}
                    className="mt-2 px-3 py-1.5 text-xs border border-red-500 text-red-600 rounded hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {cancelling === booking._id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBooking;
