import React from "react";
import Title from "../../components/Title";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";

const Rooms = () => {
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
    <div>
      <Title
        align="left"
        font="oufit"
        title="Rooms"
        subTitle="Manage room listings and availability."
      />

      <div>
        <div className="w-full max-w-4xl text-left border border-gray-300 rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-gray-800 font-medium">Title</th>
                <th className="py-3 px-4 text-gray-800 font-medium">Owner</th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                  Location
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                  Mobile
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                  Created
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                  status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rooms.map((room) => (
                <tr
                  style={{ cursor: "pointer" }}
                  key={room._id}
                  onClick={() => navigate(`/admin/rooms/${room._id}`)}
                >
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {room.title}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {room.owner?.fullName || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    {room.location}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    {room.contact}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    {room.createdAt
                      ? new Date(room.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    {room.approvalStatus === "pending" && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        pending
                      </span>
                    )}
                    {room.approvalStatus === "approved" && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Approved
                      </span>
                    )}
                    {room.approvalStatus === "rejected" && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                        Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
