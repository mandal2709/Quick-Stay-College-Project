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

      <div className="space-y-4 md:hidden">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => navigate(`/admin/rooms/${room._id}`)}
            className="cursor-pointer rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {room.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {room.owner?.fullName || "—"}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 capitalize">
                {room.approvalStatus || "unknown"}
              </span>
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-800">Location:</span>{" "}
                {room.location}
              </div>
              <div>
                <span className="font-medium text-gray-800">Mobile:</span>{" "}
                {room.contact}
              </div>
              <div>
                <span className="font-medium text-gray-800">Created:</span>{" "}
                {room.createdAt
                  ? new Date(room.createdAt).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden w-full max-w-4xl overflow-x-auto rounded-lg border border-gray-300 text-left md:block">
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
  );
};

export default Rooms;
