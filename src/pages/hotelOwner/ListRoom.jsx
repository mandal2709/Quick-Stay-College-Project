import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

      <div className="mt-4 w-full overflow-x-auto rounded-lg border border-gray-300 text-left">
      <table className="w-full min-w-[700px]">
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
            <th className="py-3 px-4 text-gray-800 font-medium text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rooms.map((item, index) => {
            // Get amenities that are true
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
                  ${item.price}
                </td>

                <td className="py-3 px-4 border-gray-300 text-center">
                  <div className="flex items-center justify-center gap-4">
                    {/* Edit Icon */}
                    <img
                      src={assets.addIcon}
                      alt="Edit"
                      className="w-5 h-5 cursor-pointer hover:opacity-70 transition"
                      onClick={() => navigate(`/owner/update-room/${item._id}`)}
                    />

                    {/* Toggle Switch */}
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
