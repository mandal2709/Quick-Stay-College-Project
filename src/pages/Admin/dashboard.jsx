import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import axios from "axios";
import API_BASE_URL from "../../config/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p className="font-medium">Unable to load admin dashboard</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Title
        align="left"
        font="oufit"
        title="Admin Dashboard"
        subTitle="Monitor overall platform activity, manage users, rooms and bookings."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <div className="flex flex-col font-medium">
            <p className="text-blue-500 text-lg">Total Users</p>
            <p className="text-neutral-400 text-base">{stats.userCount}</p>
          </div>
        </div>

        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <div className="flex flex-col font-medium">
            <p className="text-blue-500 text-lg">Total Rooms</p>
            <p className="text-neutral-400 text-base">{stats.roomCount}</p>
          </div>
        </div>

        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <div className="flex flex-col font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-neutral-400 text-base">{stats.bookingCount}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl text-blue-950/70 font-medium mb-5">
        Recent Bookings
      </h2>
      <div className="max-h-80 w-full max-w-3xl overflow-x-auto overflow-y-scroll rounded-lg border border-gray-300 text-left">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">User</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Room</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Total
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {stats.recentBookings?.length ? (
              stats.recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {booking.user?.fullName || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {booking.room?.roomType || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    ₹{booking.totalPrice?.toFixed(2) ?? "—"}
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300 flex justify-center">
                    <span
                      className={`py-1 px-3 text-xs rounded-full ${
                        booking.status === "cancelled"
                          ? "bg-amber-200 text-yellow-700"
                          : "bg-green-200 text-green-600"
                      }`}
                    >
                      {booking.status === "cancelled" ? "Cancelled" : "Active"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-4 text-gray-700" colSpan={4}>
                  No recent bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
