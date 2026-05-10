import React from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import API_BASE_URL from "../../config/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });
  useEffect(() => {
    // Fetch dashboard data from the server
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/bookings/owner-bookings`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        setDashboardData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <Title
        align="left"
        font="oufit"
        title="Dashboard"
        subTitle="Monitor Your room listings, trackbooking
      and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations"
      />

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total Booking */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Totle Bookings</p>
            <p className="text-neutral-400 text-base">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>

        {/*Total Revenue */}

        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Totle Revenue</p>
            <p className="text-neutral-400 text-base">
              ₹{dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Booking */}

      <h2 className="text-xl text-blue-950/70 font-medium mb-5">
        Recent Booking
      </h2>

      <div className="max-h-80 w-full max-w-3xl overflow-x-auto overflow-y-scroll rounded-lg border border-gray-300 text-left">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Room Name
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Totle Amount
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Payment Status
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {dashboardData?.bookings?.length > 0 ? (
              dashboardData.bookings.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.user?.fullName || "Unknown User"}
                  </td>

                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.room?.roomType || "Unknown Room"}
                  </td>

                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    ₹{item.totalPrice}
                  </td>

                  <td className="py-3 px-4 border-t border-gray-300 flex">
                    <button
                      className={`py-1 px-3 text-xs rounded-full mx-auto ${
                        item.isPaid
                          ? "bg-green-200 text-green-600"
                          : "bg-amber-200 text-yellow-600"
                      }`}
                    >
                      {item.status || (item.isPaid ? "Completed" : "Pending")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-4 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
