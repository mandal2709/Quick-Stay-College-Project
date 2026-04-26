import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import API_BASE_URL from "../config/api";

const RoomDetailes = () => {
  const { id } = useParams();
  const [room, setRoom] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
  });

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 1, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.checkIn || !formData.checkOut) {
      alert("Please fill in all fields");
      return;
    }

    const checkAvailabilityData = {
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
    };

    try {
      fetch(`${API_BASE_URL}/api/availability/check-availability/${id}`, {
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

  const navigate = useNavigate();

  const handleNewReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      alert("Please write a review comment");
      return;
    }

    setReviewSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newReview),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Review submitted successfully");
        setReviews((prev) => [...prev, data.review]);
        setNewReview({ rating: 5, comment: "" });
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rooms/${id}`);
        const data = await response.json();
        setRoom(data);
        setMainImage(
          data.images && data.images.length > 0 ? data.images[0] : null,
        );
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const onBookNow = () => {
    navigate(`/booking/${id}`);
  };

  if (!room || Object.keys(room).length === 0) {
    return (
      <div className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const getNextDay = (date) => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next.toISOString().split("T")[0];
  };
  return (
    <div className="px-4 py-24 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      {/* Room Details */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold leading-tight">
          {room.title}
          <span className="font-inter text-xs sm:text-sm ml-2">
            {" "}
            ({room.roomType})
          </span>
        </h1>
        <p className="text-xs font-inter py-1 px-2.5 sm:py-1.5 sm:px-3 text-white bg-orange-500 rounded-full whitespace-nowrap">
          20% OFF
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-3 sm:mt-4">
        <StarRating />
        <p className="text-sm md:text-base">200+ reviews</p>
      </div>

      {/* Address */}
      <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm md:text-base">
        <img
          src={assets.locationIcon}
          alt="location"
          className="w-4 h-4 sm:w-5 sm:h-5"
        />
        <span>{room.location}</span>
      </div>

      {/* Images */}
      <div className="flex flex-col lg:flex-row mt-6 sm:mt-8 lg:mt-10 gap-3 sm:gap-4 lg:gap-6">
        {/* Main Image */}
        <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-[420px]">
          <img
            src={mainImage}
            alt="Main Room"
            className="w-full h-full rounded-lg sm:rounded-xl shadow-md sm:shadow-lg object-cover"
          />
        </div>

        {/* Side Images */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 h-64 sm:h-80 md:h-96 lg:h-[420px]">
          {(room.images || []).slice(0, 4).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Room View ${index + 1}`}
              onClick={() => setMainImage(image)}
              className={`w-full h-full rounded-lg sm:rounded-xl shadow-md object-cover cursor-pointer transition-all ${
                mainImage === image
                  ? "outline outline-2 outline-orange-500"
                  : "hover:shadow-lg"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="flex flex-col lg:flex-row lg:justify-between mt-8 sm:mt-10 lg:mt-12 gap-6 lg:gap-8">
        <div className="flex-1">
          <p className="text-2xl sm:text-3xl md:text-4xl font-playfair">
            {room.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6 mb-6">
            {Object.keys(room.amenities || {})
              .filter((item) => room.amenities[item])
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#F5F5FF]/70 text-xs sm:text-sm"
                >
                  <p>{item}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-4">
          <p className="text-2xl font-semibold sm:text-3xl md:text-4xl">
            ${room.price}/night
          </p>

          <button
            onClick={onBookNow}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all
    text-white rounded-md px-6 sm:px-8 py-2.5 sm:py-3 cursor-pointer 
    font-medium text-sm sm:text-base whitespace-nowrap"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Check In / Out */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 md:gap-8 
        bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.1)] md:shadow-[0px_0px_20px_rgba(0,0,0,0.15)] 
        p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl mt-8 sm:mt-10 lg:mt-16"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 md:gap-8 flex-1">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="font-medium text-sm md:text-base text-gray-700">
              Check-In
            </label>
            <input
              type="date"
              name="checkIn"
              id="checkIn"
              onChange={handleChange}
              value={formData.checkIn}
              min={new Date().toISOString().split("T")[0]}
              className="rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-blue-500 text-sm w-full"
              required
            />
          </div>

          <div className="w-full sm:w-px h-px sm:h-10 bg-gray-300 hidden sm:block"></div>

          <div className="flex flex-col w-full sm:w-auto">
            <label className="font-medium text-sm md:text-base text-gray-700">
              Check-Out
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              onChange={handleChange}
              value={formData.checkOut}
              min={
                formData.checkIn
                  ? getNextDay(formData.checkIn) // ✅ always +1 day
                  : getNextDay(new Date()) // default = tomorrow
              }
              className="rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-blue-500 text-sm w-full"
              required
            />
          </div>

          {/* <div className="w-full sm:w-px h-px sm:h-10 bg-gray-300 hidden sm:block"></div> */}

          {/* <div className="flex flex-col w-full sm:w-auto">
            <label className="font-medium text-sm md:text-base text-gray-700">
              Guests
            </label>
            <input
              type="number"
              placeholder="0"
              className="rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none focus:border-blue-500 text-sm w-full sm:w-24"
              required
            />
          </div> */}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all
          text-white rounded-md px-6 sm:px-8 md:px-10 py-2.5 md:py-3 cursor-pointer font-medium text-sm md:text-base whitespace-nowrap"
        >
          Check Availability
        </button>
      </form>

      {/* Reviews */}
      <div className="mt-10 sm:mt-12 p-4 sm:p-5 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Guest Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 mb-4">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-3 mb-4">
            {reviews.map((review, index) => (
              <div
                key={`${review._id || index}-${index}`}
                className="border rounded-md p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{review.name || "Anonymous"}</p>
                  <div className="flex items-center gap-1">
                    <StarRating rating={Number(review.rating) || 0} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleReviewSubmit} className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Your rating
            </span>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    setNewReview((prev) => ({ ...prev, rating: r }))
                  }
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label={`Select ${r} star${r > 1 ? "s" : ""}`}
                >
                  <img
                    src={
                      r <= newReview.rating
                        ? assets.starIconFilled
                        : assets.starIconOutlined
                    }
                    alt={`${r <= newReview.rating ? "filled" : "empty"} star`}
                    className="w-6 h-6"
                  />
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Your review
            </span>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleNewReviewChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Share your experience..."
              required
            />
          </label>

          <button
            type="submit"
            disabled={reviewSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md px-4 py-2"
          >
            {reviewSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Common Specs */}
      <div className="mt-12 sm:mt-16 lg:mt-20 space-y-4 sm:space-y-5">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-3 sm:gap-4">
            <img
              src={spec.icon}
              alt={spec.title}
              className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium text-gray-800">
                {spec.title}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                {spec.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Host */}
      <div className="flex flex-col items-start gap-3 sm:gap-4 mt-12 sm:mt-16 lg:mt-20 pb-10">
        <p className="text-base sm:text-lg md:text-xl font-semibold">
          {`Hosted by ${room.owner?.fullName || "our partner"}`}
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded transition-all cursor-pointer text-sm sm:text-base font-medium">
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetailes;
