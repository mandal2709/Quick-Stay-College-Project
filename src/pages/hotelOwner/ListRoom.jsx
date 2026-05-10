import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [discountPrice, setDiscountPrice] = useState({});
  const [applyingDiscount, setApplyingDiscount] = useState(null);
  const [removingDiscount, setRemovingDiscount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE_URL}/api/rooms/my-rooms`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch rooms");
          setRooms([]);
          return;
        }

        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error.message || "Error fetching rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDiscount = async (roomId) => {
    const price = parseFloat(discountPrice[roomId]);
    if (isNaN(price) || price < 0) {
      alert("Please enter a valid discount price");
      return;
    }

    try {
      setApplyingDiscount(roomId);
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${roomId}/discount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            discountPrice: price,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Update the room in state with new discount
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === roomId ? { ...room, discount: price } : room,
        ),
      );

      // Clear the discount input for this room
      setDiscountPrice((prev) => ({
        ...prev,
        [roomId]: "",
      }));

      alert("Discount Applied Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to apply discount");
    } finally {
      setApplyingDiscount(null);
    }
  };

  const handleRemoveDiscount = async (roomId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove the discount?",
    );
    if (!confirmRemove) return;

    try {
      setRemovingDiscount(roomId);
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${roomId}/discount`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Update the room in state
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === roomId ? { ...room, discount: 0 } : room,
        ),
      );

      alert("Discount Removed Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to remove discount");
    } finally {
      setRemovingDiscount(null);
    }
  };

  return (
    <div className="py-20 md:py-28 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32">
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />

      <p className="text-gray-500 mt-8"> All Rooms</p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mt-4 mb-4">
          Loading your rooms...
        </div>
      )}

      {/* No Rooms */}
      {!loading && rooms.length === 0 && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4 mb-4">
          No rooms listed yet. Create your first room!
        </div>
      )}

      <div className="mt-4 space-y-4 md:hidden">
        {rooms.map((item, index) => {
          const amenitiesList = Object.keys(item.amenities || {})
            .filter((key) => item.amenities[key])
            .map(
              (key) =>
                key.charAt(0).toUpperCase() +
                key
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim(),
            );

          return (
            <div
              key={index}
              className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.roomType}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/owner/update-room/${item._id}`)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid gap-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">Price:</span> ₹
                    {item.price}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Discount:</span>{" "}
                    {item.discount > 0 ? `₹${item.discount}` : "No discount"}
                  </p>
                  {amenitiesList.length > 0 && (
                    <p>
                      <span className="font-medium text-gray-800">
                        Amenities:
                      </span>{" "}
                      {amenitiesList.join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder={`Discount ₹${item.price}`}
                    value={discountPrice[item._id] || ""}
                    onChange={(e) =>
                      setDiscountPrice({
                        ...discountPrice,
                        [item._id]: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <div className="flex gap-2">
                    <button
                      disabled={applyingDiscount === item._id}
                      className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDiscount(item._id)}
                    >
                      {applyingDiscount === item._id ? "Applying..." : "Apply"}
                    </button>
                    {item.discount > 0 && (
                      <button
                        disabled={removingDiscount === item._id}
                        className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleRemoveDiscount(item._id)}
                      >
                        {removingDiscount === item._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 hidden overflow-x-auto rounded-lg border border-gray-300 text-left md:block">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium text-left">
                Title
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-left max-sm:hidden">
                Type
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-left max-md:hidden">
                Amenities
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-left">
                Price / night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-left max-lg:hidden">
                Discount
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rooms.map((item, index) => {
              const amenitiesList = Object.keys(item.amenities || {})
                .filter((key) => item.amenities[key])
                .map(
                  (key) =>
                    key.charAt(0).toUpperCase() +
                    key
                      .slice(1)
                      .replace(/([A-Z])/g, " $1")
                      .trim(),
                );

              return (
                <tr
                  key={index}
                  className="border-t border-gray-300 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-700">{item.title}</td>

                  <td className="py-3 px-4 text-gray-700 max-sm:hidden">
                    {item.roomType}
                  </td>

                  <td className="py-3 px-4 text-gray-700 max-md:hidden">
                    <div className="text-xs max-w-xs">
                      {amenitiesList.length > 0
                        ? amenitiesList.join(", ")
                        : "No amenities"}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-gray-700 font-medium">
                    ₹{item.price}
                  </td>

                  <td className="py-3 px-4 text-gray-700 max-lg:hidden">
                    {item.discount > 0 ? (
                      <div className="text-sm">
                        <p className="font-medium text-blue-600">
                          Discount: ₹{item.discount}
                        </p>
                        <p className="text-green-600 font-semibold">
                          Discounted: ₹{item.price - item.discount}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">No discount</span>
                    )}
                  </td>

                  <td className="py-3 px-4 border-gray-300">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={assets.editIcon}
                          alt="Edit"
                          className="w-5 h-5 cursor-pointer hover:opacity-70 transition"
                          onClick={() =>
                            navigate(`/owner/update-room/${item._id}`)
                          }
                        />
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={true}
                          />
                          <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200"></div>
                          <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          type="number"
                          placeholder={`Discount ₹${item.price}`}
                          value={discountPrice[item._id] || ""}
                          onChange={(e) =>
                            setDiscountPrice({
                              ...discountPrice,
                              [item._id]: e.target.value,
                            })
                          }
                          className="px-3 py-2 rounded border border-gray-300 bg-gray-50 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <div className="flex gap-2">
                          <button
                            disabled={applyingDiscount === item._id}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-xs font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDiscount(item._id)}
                          >
                            {applyingDiscount === item._id
                              ? "Applying..."
                              : "Apply"}
                          </button>
                          {item.discount > 0 && (
                            <button
                              disabled={removingDiscount === item._id}
                              className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-xs font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleRemoveDiscount(item._id)}
                            >
                              {removingDiscount === item._id
                                ? "Removing..."
                                : "Remove"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
