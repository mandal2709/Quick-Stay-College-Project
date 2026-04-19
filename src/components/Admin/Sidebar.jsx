import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: assets.dashboardIcon },
    { name: "Users", path: "/admin/users", icon: assets.listIcon },
    { name: "Rooms", path: "/admin/rooms", icon: assets.addIcon },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: assets.totalBookingIcon,
    },
  ];

  return (
    <div
      className="flex w-full gap-2 overflow-x-auto border-b border-gray-300 bg-white p-3 text-base transition-all duration-300 lg:w-64 lg:flex-col lg:border-b-0 lg:border-r lg:pt-4"
    >
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end={item.path === "/admin"}
          className={({ isActive }) =>
            `flex min-w-fit items-center gap-3 rounded-lg px-4 py-3 lg:rounded-none lg:px-8 ${
              isActive
                ? "bg-blue-600/10 text-blue-600 lg:border-r-4 lg:border-blue-600"
                : "text-gray-700 hover:bg-gray-100/90"
            }`
          }
        >
          <img src={item.icon} alt={item.name} className="min-h-6 min-w-6" />
          <p className="block text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
