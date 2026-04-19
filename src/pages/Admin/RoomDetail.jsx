import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import API_BASE_URL from "../../config/api";

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleApprove = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/approve-room/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
        },
      );
      const data = await response.json();
      if (response.ok) {
        alert("Room approved successfully");
        setRoom({ ...room, approvalStatus: "approved" });
      } else {
        alert(data.message || "Failed to approve room");
      }
    } catch (error) {
      console.error("Error approving room:", error);
      alert("Error approving room");
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/reject-room/${id}`,
        {
          method: "PUT",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
        },
      );
      const data = await response.json();
      if (response.ok) {
        alert("Room rejected successfully");
        setRoom({ ...room, approvalStatus: "rejected" });
      } else {
        alert(data.message || "Failed to reject room");
      }
    } catch (error) {
      console.error("Error rejecting room:", error);
      alert("Error rejecting room");
    }
  };

  const viewHome = () => {
    navigate("/");
  };

  const goToRoomsTable = () => {
    navigate("/admin/rooms");
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="py-20 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Room not found</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 md:px-12">
      <Title title="Room Details" subTitle="Review and manage room approval" />

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            <img
              src={room.images[0]}
              alt={room.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex gap-2 mt-2">
              {room.images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${room.title} ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{room.title}</h2>
            <p className="text-gray-600 mb-2">
              <strong>Location:</strong> {room.location}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Price per night:</strong> ${room.price}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Contact:</strong> {room.contact}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Room Type:</strong> {room.roomType}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Owner:</strong> {room.owner?.fullName || "N/A"}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong> {room.description}
            </p>

            {/* Amenities */}
            <div className="mb-4">
              <strong>Amenities:</strong>
              <ul className="list-disc list-inside mt-2">
                {room.amenities?.wifi && <li>Free Wi-Fi</li>}
                {room.amenities?.breakfast && <li>Free Breakfast</li>}
                {room.amenities?.roomService && <li>Room Service</li>}
                {room.amenities?.airConditioning && <li>Air Conditioning</li>}
                {room.amenities?.parking && <li>Parking</li>}
              </ul>
            </div>

            {/* Status */}
            <p className="mb-4">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  room.approvalStatus === "approved"
                    ? "bg-green-100 text-green-800"
                    : room.approvalStatus === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {room.approvalStatus}
              </span>
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={goToRoomsTable}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back to Rooms
              </button>
              {room.approvalStatus === "pending" && (
                <>
                  <button
                    onClick={handleApprove}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
